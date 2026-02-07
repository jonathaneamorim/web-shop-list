import { Product } from "./Product";

export class ShoppingList {
  id: string;
  name: string;
  createdAt: string;
  items: Product[];

  constructor(name: string) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.createdAt = new Date().toISOString();
    this.items = [];
  }
}