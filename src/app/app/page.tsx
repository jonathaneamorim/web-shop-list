"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingList } from "@/app/entities/ShoppingList";
import { StorageService } from "@/app/services/StorageService";

export default function AppMain() {
  const router = useRouter();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [listToDelete, setListToDelete] = useState<string | null>(null);

  useEffect(() => {
    const saved = StorageService.getLists();
    const handler = requestAnimationFrame(() => {
      setLists(saved);
    });
    return () => cancelAnimationFrame(handler);
  }, []);

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
        const updatedList = { 
          ...listToUpdate, 
          name, 
          createdAt: new Date(date).toISOString() 
        } as ShoppingList;
        StorageService.updateList(updatedList);
        setLists(prev => prev.map(l => l.id === editingListId ? updatedList : l));
      }
    } else {
      const newList = new ShoppingList(name, new Date(date).toISOString());
      StorageService.save(newList);
      setLists(prev => [...prev, newList]);
    }

    setIsModalOpen(false);
    setName("");
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
      setLists((prev) => prev.filter(l => l.id !== listToDelete));
      setListToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12" suppressHydrationWarning>
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight uppercase">Minhas Listas</h1>
          <p className="text-gray-400 mt-1 font-bold text-xs uppercase tracking-widest">Gerencie suas compras</p>
        </div>
        
        <button 
          onClick={handleOpenCreateModal}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          Nova Lista
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-300 font-black uppercase tracking-widest text-xs">Nenhuma lista encontrada</p>
          </div>
        ) : (
          lists.map((list) => (
            <div 
              key={list.id} 
              onClick={() => router.push(`/app/${list.id}`)}
              className={`group relative bg-white p-8 rounded-[2.5rem] shadow-sm border transition-all cursor-pointer ${list.completed ? 'opacity-60 border-gray-100 bg-gray-50/50' : 'border-gray-100 hover:shadow-xl hover:border-blue-200'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleListCompletion(list); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all shadow-sm border-2 font-black text-[10px] uppercase tracking-widest ${list.completed ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-400 hover:text-blue-600'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  {list.completed ? "Concluída" : "Concluir"}
                </button>
                
                <div className="flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleOpenEditModal(list); }}
                    className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setListToDelete(list.id); }}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              
              <h2 className={`text-xl font-black uppercase tracking-tighter mb-2 truncate ${list.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {list.name}
              </h2>
              
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase ${list.completed ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>
                  {list.items?.length || 0} Itens
                </span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {new Date(list.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          ))
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-blue-600 p-8 text-white text-center">
              <h2 className="text-xl font-black uppercase tracking-[0.3em]">{editingListId ? "Editar Lista" : "Nova Lista"}</h2>
            </div>
            
            <div className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome da Lista</label>
                <input 
                  autoFocus
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 font-bold placeholder:text-gray-500 placeholder:opacity-100 shadow-inner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Rancho do Mês"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Data Planejada</label>
                <input 
                  type="date"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 font-bold shadow-inner"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-5 font-black text-xs uppercase tracking-widest text-gray-400 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors">Cancelar</button>
                <button onClick={handleSaveList} className="flex-1 px-4 py-5 font-black text-xs uppercase tracking-widest text-white bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                  {editingListId ? "Atualizar" : "Criar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {listToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-red-900/20 backdrop-blur-sm" onClick={() => setListToDelete(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-[3rem] shadow-2xl border border-red-50 p-10 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Apagar Lista?</h3>
            <p className="text-gray-400 mb-10 text-xs font-bold uppercase tracking-widest">Essa ação é permanente</p>
            
            <div className="flex gap-3">
              <button onClick={() => setListToDelete(null)} className="flex-1 py-4 font-black text-xs uppercase tracking-widest text-gray-400 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors">Voltar</button>
              <button onClick={confirmDelete} className="flex-1 py-4 font-black text-xs uppercase tracking-widest text-white bg-red-500 rounded-2xl hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-100">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}