"use client";

import { useState, useEffect } from "react";
import { ShoppingList } from "@/src/app/entities/ShoppingList";
import { StorageService } from "@/src/app/services/StorageService";

export default function AppMain() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const loadData = () => {
      const saved = StorageService.getLists();
      if (saved.length > 0) {
        setLists(saved);
      }
    };

    loadData();
  }, []);

  const handleCreate = () => {
    if (!name.trim()) return;
    const newList = new ShoppingList(name);
    StorageService.save(newList);
    setLists((prev) => [...prev, newList]);
    setName("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex gap-4 mb-10">
        <input 
          className="flex-1 border-b-2 border-black p-2 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da nova lista"
        />
        <button 
          onClick={handleCreate} 
          className="bg-black text-white px-6 py-2 font-bold"
        >
          CRIAR
        </button>
      </div>

      <div className="grid gap-4">
        {lists.map(list => (
          <div 
            key={list.id} 
            className="p-5 border border-gray-200 rounded-xl flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold text-xl">{list.name}</h2>
              <span className="text-xs text-gray-500 uppercase">
                {new Date(list.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-black text-white text-xs px-2 py-1 rounded">
                {list.items?.length || 0} ITENS
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}