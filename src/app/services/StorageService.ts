import { ShoppingList } from "@/app/entities/ShoppingList";

export class StorageService {
  private static KEY = "@shopping-app:lists";

  static getLists(): ShoppingList[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : [];
  }

  static getListById(id: string): ShoppingList | undefined {
    const lists = this.getLists();
    return lists.find(l => l.id === id);
  }

  static saveAll(lists: ShoppingList[]): void {
    localStorage.setItem(this.KEY, JSON.stringify(lists));
  }

  static updateList(updatedList: ShoppingList): void {
    const lists = this.getLists();
    const index = lists.findIndex(l => l.id === updatedList.id);
    if (index !== -1) {
      lists[index] = updatedList;
      this.saveAll(lists);
    }
  }

  static delete(id: string): void {
    const lists = this.getLists();
    const filtered = lists.filter(l => l.id !== id);
    this.saveAll(filtered);
  }

  static save(list: ShoppingList): void {
    const lists = this.getLists();
    lists.push(list);
    this.saveAll(lists);
  }
}