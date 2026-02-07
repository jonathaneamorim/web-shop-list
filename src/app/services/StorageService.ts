import { ShoppingList } from "../entities/ShoppingList";

export class StorageService {
  private static KEY = "@shopping-app:lists";

  static getLists(): ShoppingList[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : [];
  }

  static save(list: ShoppingList): void {
    const lists = this.getLists();
    lists.push(list);
    localStorage.setItem(this.KEY, JSON.stringify(lists));
  }
}