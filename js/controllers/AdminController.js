import { api } from "../services/api.js";
import { validateProduct } from "../utils/validation.js";

let allProducts = [];
const productModal = new bootstrap.Modal(document.getElementById("productModal"));

let currentPage = 1;
const pageSize = 5; // Số sản phẩm mỗi trang

// Load danh sách sản phẩm và render
async function fetchAndRenderProducts() {
  try {
    allProducts = await api.getAll();
    renderProductTable(allProducts);
    renderPagination(allProducts.length);
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
    document.getElementById("adminProductList").innerHTML = `
      <tr><td colspan="6" class="text-danger text-center">Không thể tải dữ liệu sản phẩm</td></tr>
    `;
  }
}

// Sort sản phẩm theo giá
document.getElementById("sortSelect").addEventListener("change", (e) => {
  const direction = e.target.value;
  let sorted = [...allProducts];
  if (direction === "asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (direction === "desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (direction === "name-asc") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (direction === "name-desc") {
    sorted.sort((a, b) => b.name.localeCompare(a.name));
  }
  renderProductTable(sorted);
  renderPagination(sorted.length);
});

// Search sản phẩm theo tên
document.getElementById("searchInput").addEventListener("input", (e) => {
  const keyword = e.target.value.trim().toLowerCase();
  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(keyword));
  renderProductTable(filtered);
  renderPagination(filtered.length);
});
// Lọc sản phẩm theo loại
document.getElementById("filterTypeSelect").addEventListener("change", (e) => {
  const selectedType = e.target.value;
  let filtered = [...allProducts];

  if (selectedType) {
    filtered = filtered.filter(p => p.type.toLowerCase() === selectedType.toLowerCase());
  }

  renderProductTable(filtered);
  renderPagination(filtered.length);
});

// Bấm nút "Thêm sản phẩm"
document.getElementById("addBtn").addEventListener("click", () => {
  document.getElementById("productForm").reset();
  document.getElementById("productId").value = "";
  document.getElementById("productModalLabel").textContent = "Thêm sản phẩm";
  productModal.show();
});

// Submit form: Thêm mới hoặc cập nhật
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("productId").value.trim();
  const newProduct = {
    name: document.getElementById("productName").value.trim(),
    type: document.getElementById("productType").value.trim(),
    price: +document.getElementById("productPrice").value,
    quantity: +document.getElementById("productQuantity").value,
    img: document.getElementById("productImg").value.trim(),
    screen: document.getElementById("productScreen").value.trim(),
    frontCamera: document.getElementById("productFrontCamera").value.trim(),
    backCamera: document.getElementById("productBackCamera").value.trim(),
    desc: document.getElementById("productDesc").value.trim(),
  };

  const errors = validateProduct(newProduct);
  if (errors.length > 0) {
    alert(errors.join("\n"));
    return;
  }

  try {
    if (id) {
      await api.update(id, newProduct);
      alert("✅ Đã cập nhật sản phẩm!");
    } else {
      await api.create(newProduct);
      alert("✅ Đã thêm sản phẩm mới!");
    }
    productModal.hide();
    document.getElementById("productForm").reset();
    fetchAndRenderProducts();
  } catch (err) {
    alert("❌ Lỗi khi lưu sản phẩm.");
    console.error(err);
  }
});

// Hiển thị danh sách sản phẩm (có phân trang)
function renderProductTable(products) {
  const tbody = document.getElementById("adminProductList");
  if (!tbody) return;

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageProducts = products.slice(start, end);

  tbody.innerHTML = pageProducts.map(p => `
    <tr>
      <td>${p.name}</td>
      <td>${p.type}</td>
      <td>${p.price.toLocaleString()}vnđ</td>
      <td>${p.quantity}</td>
      <td><img src="${p.img}" width="50"></td>
      <td>
        <button class="btn btn-warning btn-sm" data-id="${p.id}">Sửa</button>
        <button class="btn btn-danger btn-sm" data-id="${p.id}">Xoá</button>
      </td>
    </tr>
  `).join("");

  attachEditButtons();
  attachDeleteButtons();
}

function renderPagination(totalItems) {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(totalItems / pageSize);

  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${i === currentPage ? "active" : ""}">
      <a class="page-link" href="#">${i}</a>
    </li>`;
  }
  pagination.innerHTML = html;

  document.querySelectorAll(".page-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = +e.target.textContent;
      renderProductTable(allProducts);
    });
  });
}

function attachEditButtons() {
  document.querySelectorAll('.btn-warning').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute("data-id");
      try {
        const product = await api.getById(id);
        document.getElementById("productId").value = product.id;
        document.getElementById("productName").value = product.name;
        document.getElementById("productType").value = product.type;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productQuantity").value = product.quantity;
        document.getElementById("productScreen").value = product.screen || "";
        document.getElementById("productFrontCamera").value = product.frontCamera || "";
        document.getElementById("productBackCamera").value = product.backCamera || "";
        document.getElementById("productDesc").value = product.desc || "";
        document.getElementById("productImg").value = product.img;
        document.getElementById("productModalLabel").textContent = "Cập nhật sản phẩm";
        productModal.show();
      } catch (error) {
        alert("❌ Lỗi khi tải dữ liệu sản phẩm.");
        console.error(error);
      }
    });
  });
}

function attachDeleteButtons() {
  document.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute("data-id");
      const confirmDelete = confirm("❗Bạn có chắc chắn muốn xoá sản phẩm này?");
      if (!confirmDelete) return;
      try {
        await api.delete(id);
        alert("🗑️ Đã xoá sản phẩm!");
        fetchAndRenderProducts();
      } catch (error) {
        alert("❌ Lỗi khi xoá sản phẩm.");
        console.error(error);
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderProducts();
});
