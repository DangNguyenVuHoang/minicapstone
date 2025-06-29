// Lấy số lượng còn lại sau khi trừ sản phẩm trong giỏ
export function getRemainingQuantity(product, cart) {
  const itemInCart = cart.find(item => item.id == product.id);
  return product.quantity - (itemInCart?.quantity || 0);
}

// Trả về danh sách sản phẩm đã trừ số lượng
export function getAdjustedProductList(allProducts, cart) {
  return allProducts.map(product => {
    const remaining = getRemainingQuantity(product, cart);
    return { ...product, quantity: remaining };
  });
}
