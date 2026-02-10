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

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
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

  const handleSaveProduct = () => {
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
    setIsProductModalOpen(false);
    setProductName("");
    setProductQty(1);
  };

  const removeProduct = (productId: string) => {
    if (!list) return;
    const updatedItems = list.items.filter(p => p.id !== productId);
    const updatedList = { ...list, items: updatedItems } as ShoppingList;
    StorageService.updateList(updatedList);
    setList(updatedList);
  };

  if (!list) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12" suppressHydrationWarning>
      <div className="max-w-3xl mx-auto">
        <header className="flex flex-col gap-6 mb-8 text-left">
          <Link href="/app" className="inline-flex items-center justify-start gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest transition-colors hover:text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar para Listas
          </Link>
          <button 
            onClick={() => { setEditingProductId(null); setProductName(""); setProductQty(1); setIsProductModalOpen(true); }}
            className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all hover:bg-blue-700"
          >
            + Adicionar Produto
          </button>
        </header>

        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 mb-8 transition-all">
          {isEditingList ? (
            <div className="flex flex-col gap-5 animate-in fade-in duration-300">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-blue-600 uppercase ml-1 tracking-widest">Nome da Lista</label>
                <input className="w-full text-lg font-bold bg-gray-50 border-2 border-blue-500 rounded-2xl p-4 outline-none text-gray-800 placeholder:text-gray-500" value={editName} onChange={e => setEditName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-blue-600 uppercase ml-1 tracking-widest">Data Planejada</label>
                <input type="date" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 outline-none font-bold text-gray-800" value={editDate} onChange={e => setEditDate(e.target.value)} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleUpdateListInfo} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-50">Salvar</button>
                <button onClick={() => setIsEditingList(false)} className="flex-1 bg-gray-100 text-gray-400 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest">Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="w-full md:w-auto">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none break-words">{list.name}</h1>
                <p className="text-blue-600 font-bold mt-2 text-[10px] uppercase tracking-widest font-mono flex items-center gap-2">
                  <span className="bg-blue-50 px-2 py-1 rounded">📅 {new Date(list.createdAt).toLocaleDateString("pt-BR")}</span>
                </p>
              </div>
              <button 
                onClick={() => setIsEditingList(true)} 
                className="w-full md:w-auto bg-gray-50 text-gray-400 border-2 border-gray-100 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                Editar Lista
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 mb-2">Itens na Lista</h3>
          {list.items.length === 0 ? (
            <div className="text-center py-20 bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem]">
              <p className="text-gray-300 font-black uppercase tracking-widest text-[10px]">A lista está vazia</p>
            </div>
          ) : (
            list.items.map(product => (
              <div key={product.id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:border-blue-200 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg shrink-0">
                    <span className="text-[9px] font-black uppercase leading-none opacity-60">Qtd</span>
                    <span className="font-black text-xl leading-none mt-1">{product.quantity}</span>
                  </div>
                  <span className="font-bold text-gray-800 text-lg uppercase tracking-tighter leading-tight break-all">{product.name}</span>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setEditingProductId(product.id); setProductName(product.name); setProductQty(product.quantity); setIsProductModalOpen(true); }} className="p-3 md:p-4 text-gray-300 hover:text-blue-600 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                  <button onClick={() => removeProduct(product.id)} className="p-3 md:p-4 text-gray-300 hover:text-red-500 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-t-[3rem] md:rounded-[3rem] shadow-2xl p-10 animate-in slide-in-from-bottom-10 duration-300">
            <h2 className="text-center font-black uppercase text-blue-600 mb-8 tracking-[0.2em]">{editingProductId ? "Editar" : "Novo"} Item</h2>
            <div className="space-y-6">
              <input className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 font-bold outline-none focus:border-blue-500 text-gray-800" value={productName} onChange={e => setProductName(e.target.value)} placeholder="Nome do Produto" autoFocus />
              <div className="flex items-center bg-gray-100 rounded-2xl p-2 border border-gray-200">
                <button onClick={() => setProductQty(Math.max(1, productQty - 1))} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm font-black text-blue-600 text-xl active:scale-90 transition-transform">-</button>
                <div className="flex-1 text-center font-black text-2xl text-gray-800">{productQty}</div>
                <button onClick={() => setProductQty(productQty + 1)} className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-xl shadow-md font-black text-white text-xl active:scale-90 transition-transform">+</button>
              </div>
              <button onClick={handleSaveProduct} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest mt-4 shadow-lg active:scale-95 transition-all">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}