import { addToCart } from '../controllers/cartController.js'; // Đảm bảo import nếu cần

export function renderProductList(products) {
  const container = document.getElementById("productAll");
  container.innerHTML = "";

  products.forEach(product => {
    const outOfStock = product.quantity <= 0;

    const html = `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm ${outOfStock ? 'opacity-50' : ''}">
          <img src="${product.img}" class="card-img-top" style="height: 250px; object-fit: contain">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text text-muted">${product.desc}</p>
            <p><strong>Còn lại:</strong> ${product.quantity}</p>
            ${outOfStock ? `<p class="text-danger fw-bold">Sản phẩm đã hết hàng</p>` : ""}
            <div class="d-flex justify-content-between align-items-center mt-auto">
            
              <span class="fw-bold">${product.price.toLocaleString()}vnđ</span>
            </div>
            <a href="productdetail.html?id=${product.id}" class="btn btn-outline-primary mt-auto">Xem chi tiết</a>
          </div>
        </div>
      </div>
    `;

    container.innerHTML += html;
  });
}
