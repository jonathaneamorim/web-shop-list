"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingList } from "@/app/entities/ShoppingList";
import { StorageService } from "@/app/services/StorageService";

export default function AppMain() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [listToDelete, setListToDelete] = useState<string | null>(null);

  useEffect(() => {
    const saved = StorageService.getLists();
    const handler = requestAnimationFrame(() => setLists(saved));
    return () => cancelAnimationFrame(handler);
  }, []);

  const handleExport = () => StorageService.exportToCSV();
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updatedLists = await StorageService.importFromCSV(file);
      setLists(updatedLists);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleOpenCreateModal = () => {
    setEditingListId(null);
    setName("");
    setDate(new Date().toISOString().split("T")[0]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (list: ShoppingList) => {
    setEditingListId(list.id);
    setName(list.name);
    setDate(new Date(list.createdAt).toISOString().split("T")[0]);
    setIsModalOpen(true);
  };

  const handleSaveList = () => {
    if (!name.trim()) return;
    if (editingListId) {
      const listToUpdate = lists.find(l => l.id === editingListId);
      if (listToUpdate) {
        const updatedList = { ...listToUpdate, name, createdAt: new Date(date).toISOString() } as ShoppingList;
        StorageService.updateList(updatedList);
        setLists(prev => prev.map(l => l.id === editingListId ? updatedList : l));
      }
    } else {
      const newList = new ShoppingList(name, new Date(date).toISOString());
      StorageService.save(newList);
      setLists(prev => [...prev, newList]);
    }
    setIsModalOpen(false);
    setEditingListId(null);
  };

  const toggleListCompletion = (list: ShoppingList) => {
    const updatedList = { ...list, completed: !list.completed } as ShoppingList;
    StorageService.updateList(updatedList);
    setLists(prev => prev.map(l => l.id === list.id ? updatedList : l));
  };

  const confirmDelete = () => {
    if (listToDelete) {
      StorageService.delete(listToDelete);
      setLists(prev => prev.filter(l => l.id !== listToDelete));
      setListToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12" suppressHydrationWarning>
      <header className="max-w-5xl mx-auto mb-10 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">Minhas Listas</h1>
            <p className="text-gray-400 mt-1 font-bold text-[10px] uppercase tracking-[0.2em]">Backup & Organização</p>
          </div>
          
          <button 
            onClick={handleOpenCreateModal}
            className="hidden md:block bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
          >
            + Criar Lista
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-[2rem] border border-gray-100 shadow-sm mb-6 md:mb-0">
          <button onClick={handleExport} className="py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all">📥 Exportar</button>
          <label className="cursor-pointer">
            <input type="file" ref={fileInputRef} accept=".csv" className="hidden" onChange={handleImport} />
            <div className="py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-green-50 hover:text-green-600 transition-all text-center">📤 Importar</div>
          </label>
        </div>

        <button 
          onClick={handleOpenCreateModal}
          className="block md:hidden w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all"
        >
          + Criar Lista
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.map((list) => (
          <div key={list.id} onClick={() => router.push(`/app/${list.id}`)} className={`group relative bg-white p-8 rounded-[2.5rem] shadow-sm border transition-all cursor-pointer ${list.completed ? 'opacity-60 bg-gray-50' : 'hover:shadow-xl hover:border-blue-200'}`}>
            <div className="flex justify-between items-start mb-6">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleListCompletion(list); }} 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-black text-[9px] uppercase transition-all ${list.completed ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-400'}`}
              >
                {list.completed ? "Concluída" : "Concluir"}
              </button>
              
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenEditModal(list); }} 
                  className="p-3 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                  title="Editar Lista"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setListToDelete(list.id); }} 
                  className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                  title="Excluir Lista"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>

            <h2 className={`text-xl font-black uppercase truncate tracking-tighter ${list.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {list.name}
            </h2>
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
              <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase ${list.completed ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>
                {list.items?.length || 0} Itens
              </span>
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                {new Date(list.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        ))}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-blue-600 p-8 text-white text-center font-black uppercase tracking-widest">{editingListId ? "Editar" : "Nova"} Lista</div>
            <div className="p-10 space-y-6">
              <input className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 outline-none font-bold text-gray-800 placeholder:text-gray-500" value={name} onChange={e => setName(e.target.value)} placeholder="Nome da Lista" autoFocus />
              <input type="date" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 outline-none font-bold text-gray-800" value={date} onChange={e => setDate(e.target.value)} />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 font-black text-xs uppercase text-gray-400 bg-gray-100 rounded-2xl">Cancelar</button>
                <button onClick={handleSaveList} className="flex-1 py-5 font-black text-xs uppercase text-white bg-blue-600 rounded-2xl">Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {listToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-red-900/20 backdrop-blur-sm" onClick={() => setListToDelete(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter">Apagar?</h3>
            <div className="flex gap-3 mt-10">
              <button onClick={() => setListToDelete(null)} className="flex-1 py-4 font-black text-xs uppercase text-gray-400 bg-gray-100 rounded-2xl">Sair</button>
              <button onClick={confirmDelete} className="flex-1 py-4 font-black text-xs uppercase text-white bg-red-500 rounded-2xl">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}