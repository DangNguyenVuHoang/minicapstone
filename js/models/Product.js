export class Product {
  constructor(id, name, price, screen, backCamera, frontCamera, img, desc, type, quantity = 10) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.screen = screen;
    this.backCamera = backCamera;
    this.frontCamera = frontCamera;
    this.img = img;
    this.desc = desc;
    this.type = type;
    this.quantity = quantity; // quantity là số lượng tồn kho
  }
}
