import { addToCart, allProducts } from '../controllers/cartController.js';

export function renderProductDetail(product) {
  const container = document.getElementById("productDetail");
  const outOfStock = product.quantity <= 0;

  // Nếu sản phẩm chưa nằm trong allProducts (do mở trực tiếp từ productdetail.html), thì thêm vào
  const existsInAll = allProducts.find(p => p.id == product.id);
  if (!existsInAll) {
    allProducts.push(product); // Để addToCart có thể hoạt động
  }

  container.innerHTML = `
    <div class="row">
      <div class="col-md-5">
        <img src="${product.img}" class="img-fluid rounded shadow-sm" alt="${product.name}">
      </div>
      <div class="col-md-7">
        <h2 class="fw-bold">${product.name}</h2>
        <h4 class="text-muted">Loại Điện thoại: ${product.type}</h4>
        <p class="text-muted">${product.screen || "Không có mô tả."}</p>
        <p class="text-muted">${product.backCamera || "Không có mô tả."}</p>
        <p class="text-muted">${product.frontCamera || "Không có mô tả."}</p>
        <p class="text-muted">${product.desc || "Không có mô tả."}</p>

        <h4 class="text-danger">${product.price.toLocaleString()}vnđ</h4>
       
        ${outOfStock ? `<p class="text-danger fw-bold">Sản phẩm đã hết hàng</p>` : ""}

      </div>
    </div>
  `;
        //   <button 
        //   class="btn ${outOfStock ? 'btn-danger' : 'btn-warning'}"
        //   ${outOfStock ? 'disabled' : ''}
        //   onclick="${!outOfStock ? `addToCart(${product.id})` : ''}"
        // >
        //   ${outOfStock ? 'Hết hàng' : 'Buy now'}
        // </button>
}
