import { Product } from "./Product";

export class ShoppingList {
  id: string;
  name: string;
  createdAt: string;
  items: Product[];
  completed: boolean;

  constructor(name: string, date?: string) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.createdAt = date || new Date().toISOString();
    this.items = [];
    this.completed = false;
  }
}