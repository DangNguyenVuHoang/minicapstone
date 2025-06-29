import { api } from './services/api.js';
import { renderProductList } from './views/productView.js';
import { renderCart } from './views/cartView.js';
import { Cart, updateCartCount, setAllProducts } from './controllers/cartController.js';
import { includeHTML } from "./utils/include.js";

let allProducts = [];


// === Hàm chính ===
window.onload = async () => {
  // 1. Load header/footer trước
  await includeHTML();
  // includeHTML();
  await import('./controllers/headerController.js'); 
  try {
    // 2. Lấy toàn bộ sản phẩm từ MockAPI
    allProducts = await api.getAll();

    // 3. Lưu sản phẩm cho controller
    setAllProducts(allProducts);

    // 4. Hiển thị sản phẩm đã trừ số lượng trong giỏ hàng
    renderAdjustedProductList();

    // 5. Hiển thị giỏ hàng
    renderCart(Cart);
    updateCartCount();

    // 6. Gắn sự kiện lọc sản phẩm
    document.getElementById("filterType")?.addEventListener("change", (e) => {
      const type = e.target.value.toLowerCase();
      const filtered = type
        ? allProducts.filter(p => p.type.toLowerCase() === type)
        : allProducts;

      // Trừ quantity đã mua từ giỏ hàng
      const adjusted = filtered.map(product => {
        const itemInCart = Cart.find(item => item.id == product.id);
        return {
          ...product,
          quantity: product.quantity - (itemInCart?.quantity || 0)
        };
      });

      renderProductList(adjusted);
    });
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
  }
};

// === Hàm render sản phẩm sau khi đã trừ giỏ hàng ===
function renderAdjustedProductList() {
  const adjusted = allProducts.map(product => {
    const itemInCart = Cart.find(item => item.id == product.id);
    return {
      ...product,
      quantity: product.quantity - (itemInCart?.quantity || 0)
    };
  });

  renderProductList(adjusted);
}
