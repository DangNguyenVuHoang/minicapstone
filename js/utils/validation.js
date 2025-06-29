export function validateProduct(product) {
  const errors = [];

  if (!product.name || product.name.trim() === "") {
    errors.push("Tên sản phẩm không được để trống.");
  }

  if (!product.type || product.type.trim() === "") {
    errors.push("Loại sản phẩm không được để trống.");
  }

  if (isNaN(product.price) || product.price < 0) {
    errors.push("Giá sản phẩm phải là số dương.");
  }

  if (!Number.isInteger(product.quantity) || product.quantity < 0) {
    errors.push("Số lượng phải là số nguyên không âm.");
  }

  if (!product.img || product.img.trim() === "") {
    errors.push("Link hình ảnh không được để trống.");
  }

  return errors;
}
