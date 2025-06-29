import { CartItem } from '../models/CartItem.js';
import { renderCart } from '../views/cartView.js';
import { renderProductList } from '../views/productView.js';
import { api } from '../services/api.js';
import { getRemainingQuantity, getAdjustedProductList } from '../utils/cartUtils.js';

export let Cart = JSON.parse(localStorage.getItem("Cart")) || [];
export let allProducts = [];

export function setAllProducts(products) {
  allProducts = products;
}

function updateProductQuantityView() {
  const container = document.getElementById("productList");
  const adjusted = getAdjustedProductList(allProducts, Cart);
  if (container) {
    renderProductList(adjusted);
  }

  // Nếu đang ở trang productdetail thì tự gọi lại render detail (nếu đã có hàm global)
  if (window.location.href.includes("productdetail.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (typeof window.refreshProductDetailFromCart === "function") {
      window.refreshProductDetailFromCart(productId);
    }
  }
}

// Thêm vào giỏ hàng
export function addToCart(productId) {
  const product = allProducts.find(p => p.id == productId);
  const remaining = getRemainingQuantity(product, Cart);

  if (!product || remaining <= 0) {
    alert("Sản phẩm đã hết hàng!");
    return;
  }

  const itemInCart = Cart.find(item => item.id == productId);
  if (!itemInCart) {
    Cart.push(new CartItem(product));
  } else {
    itemInCart.quantity++;
  }

  localStorage.setItem("Cart", JSON.stringify(Cart));
  renderCart(Cart);
  updateCartCount();
  updateProductQuantityView();
}

// Xoá sản phẩm khỏi giỏ
export function removeFromCart(productId) {
  Cart = Cart.filter(item => item.id != productId);
  localStorage.setItem("Cart", JSON.stringify(Cart));
  renderCart(Cart);
  updateCartCount();
  updateProductQuantityView();
}

// Tăng/giảm số lượng
export function changeQuantity(id, delta) {
  const index = Cart.findIndex(item => item.id == id);
  if (index !== -1) {
    Cart[index].quantity += delta;
    if (Cart[index].quantity <= 0) {
      Cart.splice(index, 1);
    }
    localStorage.setItem("Cart", JSON.stringify(Cart));
    renderCart(Cart);
    updateCartCount();
    updateProductQuantityView();
  }
}

// Thanh toán: cập nhật tồn kho thật và làm mới UI
export async function clearCart(onSuccessCallback) {
  try {
    const unavailableItems = [];

    for (const item of Cart) {
      const res = await api.getById(item.id);
      const product = res;
      if (product.quantity <= 0) {
        unavailableItems.push(product.name);
      }
    }

    if (unavailableItems.length > 0) {
      alert(`Không thể thanh toán các sản phẩm đã hết hàng:\n- ${unavailableItems.join('\n- ')}`);
      return;
    }

    const updatePromises = Cart.map(async (item) => {
      const res = await api.getById(item.id);
      const product = res;
      const newQuantity = Math.max(product.quantity - item.quantity, 0);

      return api.update(item.id, {
        ...product,
        quantity: newQuantity
      });
    });

    await Promise.all(updatePromises);

    Cart.length = 0;
    localStorage.setItem("Cart", JSON.stringify(Cart));
    renderCart(Cart);
    updateCartCount();

    alert("Thanh toán thành công. Đã cập nhật tồn kho!");

    const updatedProducts = await api.getAll();
    setAllProducts(updatedProducts);

    if (typeof onSuccessCallback === 'function') {
      onSuccessCallback(updatedProducts);
    } else {
      if (document.getElementById("productList")) {
        renderProductList(updatedProducts);
      }

      // Nếu đang ở productDetail thì cập nhật lại
      if (window.location.href.includes("productdetail.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get("id");
        if (typeof window.refreshProductDetailFromCart === "function") {
          window.refreshProductDetailFromCart(productId);
        }
      }
    }
  } catch (error) {
    console.error("Lỗi khi thanh toán:", error);
    alert("Thanh toán thất bại. Vui lòng thử lại.");
  }
}

// Cập nhật số lượng trong biểu tượng giỏ
export function updateCartCount() {
  const count = Cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cartCount").innerText = count;
}

// Cho phép gọi từ HTML
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQuantity = changeQuantity;
window.clearCart = clearCart;
