import { ShoppingList } from "@/app/entities/ShoppingList";
import { Product } from "@/app/entities/Product";

export class StorageService {
  private static KEY = "@shopping-app:lists";

  static getLists(): ShoppingList[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveAll(lists: ShoppingList[]): void {
    localStorage.setItem(this.KEY, JSON.stringify(lists));
  }

  static exportToCSV(): void {
    const lists = this.getLists();
    if (lists.length === 0) return;

    const headers = ["listId", "listName", "listCreatedAt", "listCompleted", "productName", "productQty"];
    const rows: string[][] = [];

    lists.forEach(list => {
      if (list.items.length === 0) {
        rows.push([list.id, list.name, list.createdAt, String(list.completed), "", ""]);
      } else {
        list.items.forEach(prod => {
          rows.push([list.id, list.name, list.createdAt, String(list.completed), prod.name, String(prod.quantity)]);
        });
      }
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `backup-compras-${new Date().getTime()}.csv`;
    link.click();
  }

  static async importFromCSV(file: File): Promise<ShoppingList[]> {
    const text = await file.text();
    const lines = text.split("\n").slice(1); // Pula header
    const listMap = new Map<string, ShoppingList>();

    lines.forEach(line => {
      if (!line.trim()) return;
      const [listId, listName, listCreatedAt, listCompleted, productName, productQty] = line.split(",");

      if (!listMap.has(listId)) {
        listMap.set(listId, {
          id: listId,
          name: listName,
          createdAt: listCreatedAt,
          completed: listCompleted === "true",
          items: []
        });
      }

      if (productName && productName.trim() !== "") {
        const product = new Product(productName, Number(productQty));
        listMap.get(listId)?.items.push(product);
      }
    });

    const importedLists = Array.from(listMap.values());
    this.saveAll(importedLists);
    return importedLists;
  }

  static save(list: ShoppingList): void {
    const lists = this.getLists();
    lists.push(list);
    this.saveAll(lists);
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

  static getListById(id: string): ShoppingList | undefined {
    return this.getLists().find(l => l.id === id);
  }
}