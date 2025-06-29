import { api } from "../services/api.js";
import { Cart, updateCartCount, clearCart } from "../controllers/cartController.js";
import { renderCart } from "../views/cartView.js";
import { renderProductDetail } from "../views/productDetailView.js";

// Load header/footer
async function includeHTML() {
  const elements = document.querySelectorAll("[data-include]");
  for (const el of elements) {
    const file = el.getAttribute("data-include");
    const res = await fetch(file);
    if (res.ok) el.innerHTML = await res.text();
    else el.innerHTML = `Lỗi tải ${file}`;
  }
}



async function loadAndRenderDetail(productId) {
  try {
    const product = await api.getById(productId);
    renderProductDetail(product);
  } catch (error) {
    console.error("Không thể cập nhật sản phẩm:", error);
    document.getElementById("productDetail").innerHTML = "<p class='text-danger'>Không thể tải dữ liệu sản phẩm.</p>";
  }
}

// Hàm chính
// Trong DOMContentLoaded:
window.addEventListener("DOMContentLoaded", async () => {
  await includeHTML();
const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
//   renderCart(Cart);
//   updateCartCount();
renderCart(Cart);
updateCartCount();
bindClearCartButton(productId);

  

  if (!productId) {
    document.getElementById("productDetail").innerHTML = "<p class='text-danger'>Không tìm thấy sản phẩm.</p>";
    return;
  }

  await loadAndRenderDetail(productId);

  // Sự kiện thanh toán giỏ hàng (nếu click nút Thanh toán)
function bindClearCartButton(productId) {
  const btn = document.querySelector("#cartView button.btn-success");
  if (btn) {
    btn.addEventListener("click", () => {
      clearCart((updatedProducts) => {
        const updated = updatedProducts.find(p => p.id == productId);
        if (updated) {
          renderProductDetail(updated);
        }
      });
    });
  }
}

});

