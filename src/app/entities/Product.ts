export class Product {
  id: string;
  name: string;
  quantity: number;
  bought: boolean;

  constructor(name: string, quantity: number) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.quantity = quantity;
    this.bought = false;
  }
}