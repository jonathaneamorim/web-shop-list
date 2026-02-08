"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ShoppingList } from "@/app/entities/ShoppingList";
import { Product } from "@/app/entities/Product";
import { StorageService } from "@/app/services/StorageService";
import Link from "next/link";

export default function ListDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [list, setList] = useState<ShoppingList | null>(null);
  const [isEditingList, setIsEditingList] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");

  const [productName, setProductName] = useState("");
  const [productQty, setProductQty] = useState(1);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  useEffect(() => {
    const data = StorageService.getListById(id);
    if (data) {
      const handler = requestAnimationFrame(() => {
        setList(data);
        setEditName(data.name);
        setEditDate(new Date(data.createdAt).toISOString().split("T")[0]);
      });
      return () => cancelAnimationFrame(handler);
    } else {
      router.push("/app");
    }
  }, [id, router]);

  const handleUpdateListInfo = () => {
    if (!list || !editName.trim()) return;
    const updated = { ...list, name: editName, createdAt: new Date(editDate).toISOString() } as ShoppingList;
    StorageService.updateList(updated);
    setList(updated);
    setIsEditingList(false);
  };

  const handleAddOrUpdateProduct = () => {
    if (!list || !productName.trim()) return;

    let updatedItems;
    if (editingProductId) {
      updatedItems = list.items.map(p => 
        p.id === editingProductId ? { ...p, name: productName, quantity: productQty } : p
      );
    } else {
      const newProduct = new Product(productName, productQty);
      updatedItems = [...list.items, newProduct];
    }

    const updatedList = { ...list, items: updatedItems } as ShoppingList;
    StorageService.updateList(updatedList);
    setList(updatedList);
    resetProductForm();
  };

  const resetProductForm = () => {
    setProductName("");
    setProductQty(1);
    setEditingProductId(null);
  };

  const removeProduct = (productId: string) => {
    if (!list) return;
    const updatedItems = list.items.filter(p => p.id !== productId);
    const updatedList = { ...list, items: updatedItems } as ShoppingList;
    StorageService.updateList(updatedList);
    setList(updatedList);
  };

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductName(p.name);
    setProductQty(p.quantity);
  };

  if (!list) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12" suppressHydrationWarning>
      <div className="max-w-3xl mx-auto">
        <Link href="/app" className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Voltar para Listas
        </Link>

        <header className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-8">
          {isEditingList ? (
            <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Editar Nome</label>
                <input 
                  className="w-full text-xl font-bold bg-gray-50 border-2 border-blue-500 rounded-2xl p-4 outline-none text-gray-800 placeholder:text-gray-500 placeholder:opacity-100 shadow-inner" 
                  value={editName} 
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Digite o nome da lista..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Editar Data</label>
                <input 
                  type="date" 
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 outline-none focus:border-blue-500 font-bold text-gray-800" 
                  value={editDate} 
                  onChange={e => setEditDate(e.target.value)} 
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleUpdateListInfo} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">Salvar Alterações</button>
                <button onClick={() => setIsEditingList(false)} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all">Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">{list.name}</h1>
                <p className="text-blue-600 font-bold mt-2 text-xs uppercase tracking-widest">📅 {new Date(list.createdAt).toLocaleDateString("pt-BR")}</p>
              </div>
              <button onClick={() => setIsEditingList(true)} className="bg-blue-50 text-blue-600 px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Editar Lista</button>
            </div>
          )}
        </header>

        <section className="mb-12 bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-blue-600">
          <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-6 text-center">
            {editingProductId ? "📝 Editando Item" : "🚀 Adicionar Novo Item"}
          </h2>
          
          <div className="flex flex-col gap-6">
            <input 
              className="w-full p-5 rounded-2xl bg-gray-100 border-none outline-none font-bold text-gray-800 placeholder:text-gray-500 placeholder:opacity-100 text-lg shadow-inner" 
              placeholder="O que vamos comprar?" 
              value={productName} 
              onChange={e => setProductName(e.target.value)} 
            />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center bg-gray-100 rounded-2xl p-2 shadow-inner border border-gray-200">
                <button 
                  onClick={() => setProductQty(Math.max(1, productQty - 1))}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm font-black text-blue-600 hover:bg-blue-50 active:scale-90 transition-all text-xl"
                >
                  -
                </button>
                <div className="px-8 flex flex-col items-center min-w-[100px]">
                  <span className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Qtd</span>
                  <input 
                    type="number"
                    className="bg-transparent border-none outline-none font-black text-2xl text-center text-gray-800 w-12"
                    value={productQty}
                    onChange={e => setProductQty(Math.max(1, Number(e.target.value)))}
                  />
                </div>
                <button 
                  onClick={() => setProductQty(productQty + 1)}
                  className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-xl shadow-md font-black text-white hover:bg-blue-700 active:scale-90 transition-all text-xl"
                >
                  +
                </button>
              </div>

              <button 
                onClick={handleAddOrUpdateProduct} 
                className="flex-1 h-16 bg-blue-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
              >
                {editingProductId ? "Atualizar" : "Adicionar à Lista"}
              </button>
            </div>
          </div>
          
          {editingProductId && (
            <button onClick={resetProductForm} className="mt-4 w-full text-[10px] text-gray-400 font-black uppercase tracking-widest hover:text-red-500 transition-colors">
              Cancelar Edição
            </button>
          )}
        </section>

        <div className="space-y-4">
          {list.items.length === 0 ? (
            <div className="text-center py-20 bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem]">
              <p className="text-gray-300 font-black uppercase tracking-widest text-[10px]">Ainda não há itens</p>
            </div>
          ) : (
            list.items.map(product => (
              <div key={product.id} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:border-blue-200 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg">
                    <span className="text-[9px] font-black uppercase leading-none opacity-60">Qtd</span>
                    <span className="font-black text-xl leading-none mt-1">{product.quantity}</span>
                  </div>
                  <span className="font-bold text-gray-800 text-xl uppercase tracking-tighter">{product.name}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEditProduct(product)} className="p-4 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => removeProduct(product.id)} className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}