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

    const headers = ["listId", "listName", "listCreatedAt", "listCompleted", "productName", "productQty", "productCompleted"];
    const rows: string[][] = [];

    lists.forEach(list => {
      if (list.items.length === 0) {
        rows.push([list.id, list.name, list.createdAt, String(list.completed), "", "", ""]);
      } else {
        list.items.forEach(prod => {
          rows.push([
            list.id, 
            list.name, 
            list.createdAt, 
            String(list.completed), 
            prod.name, 
            String(prod.quantity), 
            String(!!prod.completed)
          ]);
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
    return new Promise((resolve, reject) => {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        reject(new Error("Arquivo inválido. Por favor, selecione um arquivo com a extensão .csv"));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        const text = e.target?.result as string;
        
        if (!text || text.trim().length === 0) {
          reject(new Error("O arquivo está vazio."));
          return;
        }

        const lines = text.trim().split("\n");
        
        if (lines.length < 1) {
          reject(new Error("O arquivo não contém dados reconhecíveis."));
          return;
        }

        const header = lines[0].trim();
        const expectedHeader = "listId,listName,listCreatedAt,listCompleted,productName,productQty,productCompleted";

        if (header !== expectedHeader) {
          reject(new Error("Estrutura do CSV incorreta. Este arquivo não parece ser um backup do WebShopList."));
          return;
        }

        try {
          const listMap = new Map<string, ShoppingList>();
          const dataLines = lines.slice(1);

          dataLines.forEach((line, index) => {
            if (!line.trim()) return;
            
            const columns = line.split(",");
            
            if (columns.length < 7) {
              throw new Error(`Erro de formatação na linha ${index + 2}.`);
            }

            const [listId, listName, listCreatedAt, listCompleted, productName, productQty, productCompleted] = columns;

            if (!listMap.has(listId)) {
              listMap.set(listId, {
                id: listId,
                name: listName || "Lista sem nome",
                createdAt: listCreatedAt || new Date().toISOString(),
                completed: listCompleted === "true",
                items: []
              });
            }

            if (productName && productName.trim() !== "") {
              const product = new Product(productName, Number(productQty) || 1);
              product.completed = productCompleted === "true";
              listMap.get(listId)?.items.push(product);
            }
          });

          const importedLists = Array.from(listMap.values());
          this.saveAll(importedLists);
          resolve(importedLists);

        } catch (error) {
          reject(error instanceof Error ? error : new Error("Erro desconhecido ao processar o arquivo."));
        }
      };

      reader.onerror = () => reject(new Error("Falha na leitura do arquivo."));
      reader.readAsText(file);
    });
  }

  static exportListToCSV(list: ShoppingList): void {
    const headers = ["listId", "listName", "listCreatedAt", "listCompleted", "productName", "productQty", "productCompleted"];
    const rows: string[][] = [];

    if (list.items.length === 0) {
      rows.push([list.id, list.name, list.createdAt, String(list.completed), "", "", ""]);
    } else {
      list.items.forEach(prod => {
        rows.push([
          list.id,
          list.name,
          list.createdAt,
          String(list.completed),
          prod.name,
          String(prod.quantity),
          String(!!prod.completed)
        ]);
      });
    }

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    const safeName = list.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `lista-${safeName}-${new Date().getTime()}.csv`;
    link.click();
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