import { changeQuantity, removeFromCart, clearCart } from '../controllers/cartController.js';
//cartView.js
export async function renderCart(cart) {
  const container = document.getElementById("cartView");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "<p>Giỏ hàng trống</p>";
    return;
  }

  let html = `
    <table class="table">
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th>SL</th>
          <th>Giá</th>
          <th>Tổng</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
  `;

  let total = 0;

  for (const item of cart) {
    // Gọi API để lấy lại tồn kho hiện tại
    const res = await fetch(`https://685fb6d7c55df675589f0d9c.mockapi.io/products/${item.id}`);
    const product = await res.json();
    const isOutOfStock = product.quantity <= 0;

    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    html += `
      <tr class="${isOutOfStock ? 'opacity-50' : ''}">
        <td>
          <img src="${item.img}" width="50"> ${item.name}
          ${isOutOfStock ? '<div class="text-danger small">Hết hàng</div>' : ''}
        </td>
        <td>
          <button onclick="changeQuantity(${item.id}, -1)" class="btn btn-sm btn-outline-secondary" ${isOutOfStock ? 'disabled' : ''}>-</button>
          ${item.quantity}
          <button onclick="changeQuantity(${item.id}, 1)" class="btn btn-sm btn-outline-secondary" ${item.quantity >= product.quantity ? 'disabled' : ''}>+</button>
        </td>
        <td>${product.price.toLocaleString()}vnđ</td>
        <td>${itemTotal}$</td>
        <td>
          <button onclick="removeFromCart(${item.id})" class="btn btn-danger btn-sm">Xoá</button>
        </td>
      </tr>
    `;
  }

  html += `</tbody></table>
    <h5>Tổng tiền: ${total}$</h5>
    <button onclick="clearCart()" class="btn btn-success">Thanh toán</button>`;

  container.innerHTML = html;
}
