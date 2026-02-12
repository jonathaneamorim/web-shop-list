"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingList } from "@/app/entities/ShoppingList";
import { StorageService } from "@/app/services/StorageService";
import toast from "react-hot-toast";

export default function AppMain() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const saved = StorageService.getLists();
    const handler = requestAnimationFrame(() => setLists(saved));
    const closeDropdown = () => setOpenDropdownId(null);
    window.addEventListener('click', closeDropdown);
    return () => {
      cancelAnimationFrame(handler);
      window.removeEventListener('click', closeDropdown);
    };
  }, []);

  const handleExport = () => {
    if (lists.length === 0) {
      toast.error("Você não possui listas para exportar.");
      return;
    }
    StorageService.exportToCSV();
    toast.success("Backup CSV gerado!");
  };

  const handleExportSingleList = (list: ShoppingList) => {
    StorageService.exportListToCSV(list);
    toast.success(`Lista "${list.name}" exportada!`);
  };
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;

    await toast.promise(
      StorageService.importFromCSV(file).then((updatedLists) => {
        setLists(updatedLists);
        return updatedLists;
      }),
      {
        loading: 'Lendo backup...',
        success: 'Listas importadas!',
        error: (err) => err.message || "Erro ao importar",
      }
    );
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
    if (!name.trim()) {
      toast.error("Nome obrigatório");
      return;
    }

    if (editingListId) {
      const listToUpdate = lists.find(l => l.id === editingListId);
      if (listToUpdate) {
        const updatedList = { ...listToUpdate, name, createdAt: new Date(date).toISOString() } as ShoppingList;
        StorageService.updateList(updatedList);
        setLists(prev => prev.map(l => l.id === editingListId ? updatedList : l));
        toast.success("Atualizado!");
      }
    } else {
      const newList = new ShoppingList(name, new Date(date).toISOString());
      StorageService.save(newList);
      setLists(prev => [...prev, newList]);
      toast.success("Criado!");
    }
    setIsModalOpen(false);
    setEditingListId(null);
  };

  const toggleListCompletion = (list: ShoppingList) => {
    const updatedList = { ...list, completed: !list.completed } as ShoppingList;
    StorageService.updateList(updatedList);
    setLists(prev => prev.map(l => l.id === list.id ? updatedList : l));
    if (!list.completed) toast.success("Concluída!");
  };

  const confirmDelete = () => {
    if (listToDelete) {
      StorageService.delete(listToDelete);
      setLists(prev => prev.filter(l => l.id !== listToDelete));
      setListToDelete(null);
      toast.success("Apagada.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12 selection:bg-blue-100" suppressHydrationWarning>
      <header className="max-w-5xl mx-auto mb-10 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Minhas Listas</h1>
            <p className="text-gray-400 mt-1 font-bold text-[10px] uppercase tracking-[0.3em]">Gerencie suas compras</p>
          </div>
          
          <button 
            onClick={handleOpenCreateModal}
            className="hidden md:block bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all hover:-translate-y-1"
          >
            + Criar Lista
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-[2rem] border border-gray-100 shadow-sm mb-6 md:mb-0">
          <button onClick={handleExport} className="py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Exportar Tudo
          </button>
          <label className="cursor-pointer">
            <input type="file" ref={fileInputRef} accept=".csv" className="hidden" onChange={handleImport} />
            <div className="py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-green-50 hover:text-green-600 transition-all text-center flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Importar Backup
            </div>
          </label>
        </div>

        <button 
          onClick={handleOpenCreateModal}
          className="block md:hidden w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all"
        >
          + Criar Lista
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {lists.length === 0 ? (
           <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-50 select-none">
             <div className="w-24 h-24 bg-gray-200 rounded-full mb-6 flex items-center justify-center text-gray-400">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
             </div>
             <h3 className="text-2xl font-black text-gray-900 uppercase">Nenhuma lista</h3>
             <p className="text-gray-500 font-medium mt-2">Crie sua primeira lista de compras.</p>
           </div>
        ) : (
          lists.map((list) => (
            <div key={list.id} onClick={() => router.push(`/app/${list.id}`)} className={`group relative bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border transition-all cursor-pointer ${list.completed ? 'opacity-60 bg-gray-50 border-gray-100' : 'hover:shadow-xl hover:border-blue-200 border-gray-100 hover:-translate-y-1'}`}>
              
              <div className="flex justify-between items-start mb-4 md:mb-6 relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleListCompletion(list); }} 
                  className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-xl border-2 font-black text-[9px] uppercase transition-all active:scale-95 ${list.completed ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-400 hover:text-blue-500'}`}
                >
                  {list.completed ? (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      Concluída
                    </>
                  ) : "Marcar Concluída"}
                </button>
                
                <div className="relative">
                  <div className="flex min-[375px]:hidden">
                     <button 
                       onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === list.id ? null : list.id); }}
                       className="p-2 bg-gray-50 rounded-xl text-gray-400"
                     >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                     </button>
                  </div>

                  {openDropdownId === list.id && (
                    <div className="absolute right-0 top-10 z-20 bg-white shadow-xl rounded-2xl border border-gray-100 p-2 min-w-[150px] animate-in fade-in zoom-in-95 duration-200 min-[450px]:hidden flex flex-col gap-1">
                       <button onClick={(e) => { e.stopPropagation(); handleExportSingleList(list); }} className="p-3 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl">Exportar</button>
                       <button onClick={(e) => { e.stopPropagation(); handleOpenEditModal(list); }} className="p-3 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl">Editar</button>
                       <button onClick={(e) => { e.stopPropagation(); setListToDelete(list.id); }} className="p-3 text-left text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl">Excluir</button>
                    </div>
                  )}

                  <div className="hidden min-[375px]:flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleExportSingleList(list); }} className="p-3 bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600 rounded-xl transition-all active:scale-90" title="Exportar">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleOpenEditModal(list); }} className="p-3 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all active:scale-90" title="Editar">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setListToDelete(list.id); }} className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all active:scale-90" title="Excluir">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tighter mb-2 line-clamp-2 ${list.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {list.name}
              </h2>
              
              <div className="mt-6 md:mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                <span className={`text-xs font-black px-4 py-2 rounded-xl uppercase tracking-wider ${list.completed ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>
                  {list.items?.length || 0} Itens
                </span>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  {new Date(list.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          ))
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 md:pt-0 md:items-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 mt-10 md:mt-0 animate-in slide-in-from-top-10 duration-300">
            <div className="bg-blue-600 p-8 text-white text-center font-black uppercase tracking-widest text-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-20 transform -skew-x-12 translate-x-10" />
               {editingListId ? "Editar Lista" : "Nova Lista"}
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-4">Nome</label>
                <input 
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 outline-none font-bold text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white transition-all" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Ex: Rancho do Mês" 
                  autoFocus 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-4">Data</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 outline-none font-bold text-gray-800 focus:border-blue-500 focus:bg-white transition-all appearance-none uppercase" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 font-black text-xs uppercase text-gray-400 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors active:scale-95">Cancelar</button>
                <button onClick={handleSaveList} className="flex-[2] py-5 font-black text-xs uppercase text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {listToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-red-900/20 backdrop-blur-sm transition-opacity" onClick={() => setListToDelete(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter uppercase">Tem certeza?</h3>
            <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">Essa ação apagará a lista e todos os seus itens permanentemente.</p>
            <div className="flex gap-3">
              <button onClick={() => setListToDelete(null)} className="flex-1 py-4 font-black text-xs uppercase text-gray-400 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors">Cancelar</button>
              <button onClick={confirmDelete} className="flex-1 py-4 font-black text-xs uppercase text-white bg-red-500 rounded-2xl hover:bg-red-600 shadow-lg shadow-red-200 transition-colors active:scale-95">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}