"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ShoppingList } from "@/app/entities/ShoppingList";
import { Product } from "@/app/entities/Product";
import { StorageService } from "@/app/services/StorageService";
import toast from "react-hot-toast";
import Loading from "./Loading";

export default function ListDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  
  const [productName, setProductName] = useState("");
  const [productQty, setProductQty] = useState(1);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [editListName, setEditListName] = useState("");
  const [editListDate, setEditListDate] = useState("");

  useEffect(() => {
    const loadList = () => {
      const foundList = StorageService.getListById(id);
      if (!foundList) {
        toast.error("Lista não encontrada");
        router.push("/app");
        return;
      }
      setList(foundList);
    };
    loadList();
  }, [id, router]);

  const handleUpdateListInfo = () => {
    if (!list || !editListName.trim()) return;

    const updatedList = { ...list, name: editListName, createdAt: new Date(editListDate).toISOString() };
    StorageService.updateList(updatedList);
    setList(updatedList);
    setIsEditListModalOpen(false);
    toast.success("Informações atualizadas!");
  };

  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProductId(product.id);
      setProductName(product.name);
      setProductQty(product.quantity);
    } else {
      setEditingProductId(null);
      setProductName("");
      setProductQty(1);
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (!productName.trim() || !list) {
      toast.error("Nome do produto é obrigatório");
      return;
    }

    const updatedList = { ...list };

    if (editingProductId) {
      updatedList.items = updatedList.items.map(p => 
        p.id === editingProductId 
          ? { ...p, name: productName, quantity: productQty } 
          : p
      );
      toast.success("Produto atualizado!");
    } else {
      const newProduct = new Product(productName, productQty);
      updatedList.items.push(newProduct);
      toast.success("Produto adicionado!");
    }

    StorageService.updateList(updatedList);
    setList(updatedList);
    setIsProductModalOpen(false);
    setProductName("");
    setProductQty(1);
    setEditingProductId(null);
  };

  const toggleProductCompletion = (product: Product) => {
    if (!list) return;
    const updatedList = { ...list };
    updatedList.items = updatedList.items.map(p => 
      p.id === product.id ? { ...p, completed: !p.completed } : p
    );
    StorageService.updateList(updatedList);
    setList(updatedList);
  };

  const confirmDeleteProduct = () => {
    if (!list || !productToDelete) return;
    const updatedList = { ...list };
    updatedList.items = updatedList.items.filter(p => p.id !== productToDelete.id);
    StorageService.updateList(updatedList);
    setList(updatedList);
    setProductToDelete(null);
    toast.success("Produto removido.");
  };

  if (!list) return <Loading />;

  const totalItems = list.items.length;
  const completedItems = list.items.filter(i => i.completed).length;
  const progress = totalItems === 0 ? 0 : (completedItems / totalItems) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12 selection:bg-blue-100 pb-32">
      <header className="max-w-3xl mx-auto mb-6">
        <div className="mb-6">
          <button onClick={() => router.push("/app")} className="flex items-center text-gray-400 font-bold uppercase text-xs tracking-widest hover:text-blue-600 transition-colors group">
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Voltar
          </button>
        </div>
        
        <div 
          onClick={() => {
            setEditListName(list.name);
            setEditListDate(new Date(list.createdAt).toISOString().split("T")[0]);
            setIsEditListModalOpen(true);
          }}
          className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative select-none cursor-pointer hover:shadow-md hover:border-blue-200 active:scale-[0.99] transition-all group"
          title="Clique para editar informações da lista"
        >
          <div className="absolute top-6 right-6 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </div>

          <div className="flex flex-col gap-2">
             <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase leading-tight line-clamp-2 pr-8">{list.name}</h1>
             
             <div className="flex items-center gap-2 text-gray-400 mb-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               <span className="text-xs font-bold uppercase tracking-widest">{new Date(list.createdAt).toLocaleDateString("pt-BR")}</span>
             </div>

             <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-blue-600 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.3)]" style={{ width: `${progress}%` }} />
             </div>

             <div className="flex justify-between items-end mt-1">
                <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.1em]">{completedItems} de {totalItems} Itens</p>
                <div className="font-black text-blue-600 text-2xl">{Math.round(progress)}%</div>
             </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto mb-8">
        <button 
          onClick={() => handleOpenProductModal()}
          className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          Adicionar Novo Item
        </button>
      </div>

      <main className="max-w-3xl mx-auto space-y-4">
        {list.items.length === 0 ? (
          <div className="text-center py-10 opacity-50 select-none">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <p className="text-gray-500 font-medium">Sua lista está vazia.</p>
          </div>
        ) : (
          list.items.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleOpenProductModal(item)}
              className={`group flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all cursor-pointer hover:border-blue-200 hover:shadow-md active:scale-[0.98] select-none ${item.completed ? 'opacity-60 bg-gray-50' : ''}`}
            >
              <div className="flex items-center gap-5 flex-1 overflow-hidden">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleProductCompletion(item); }}
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200' : 'bg-white border-gray-100 text-transparent hover:border-blue-300'}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </button>
                
                <div className="flex flex-col truncate pr-4">
                  <span className={`text-lg font-black uppercase tracking-tight truncate ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {item.name}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Quantidade: {item.quantity}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setProductToDelete(item); }}
                  className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 md:pt-0 md:items-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] md:rounded-[3rem] shadow-2xl p-8 animate-in slide-in-from-top-10 duration-300 mt-10 md:mt-0">
            <h2 className="text-center font-black uppercase text-blue-600 mb-8 tracking-[0.2em] select-none">{editingProductId ? "Editar" : "Novo"} Item</h2>
            <div className="space-y-6">
              <input 
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 font-bold outline-none focus:border-blue-500 text-gray-800 text-lg placeholder:text-gray-400" 
                value={productName} 
                onChange={e => setProductName(e.target.value)} 
                placeholder="Nome do Produto" 
                autoFocus 
              />
              
              <div className="flex items-center bg-gray-50 rounded-2xl p-2 border-2 border-gray-100 select-none">
                <button 
                  onClick={() => setProductQty(Math.max(1, productQty - 1))} 
                  className="w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-sm font-black text-blue-600 text-2xl active:scale-90 transition-transform hover:bg-blue-50"
                >
                  -
                </button>
                <div className="flex-1 text-center font-black text-3xl text-gray-800">{productQty}</div>
                <button 
                  onClick={() => setProductQty(productQty + 1)} 
                  className="w-14 h-14 flex items-center justify-center bg-blue-600 rounded-xl shadow-lg shadow-blue-200 font-black text-white text-2xl active:scale-90 transition-transform hover:bg-blue-700"
                >
                  +
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                 <button onClick={() => setIsProductModalOpen(false)} className="flex-1 py-5 font-black text-xs uppercase text-gray-400 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors select-none">Cancelar</button>
                 <button onClick={handleSaveProduct} className="flex-[2] bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 active:scale-95 transition-all hover:bg-blue-700 select-none">Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 md:pt-0 md:items-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={() => setIsEditListModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] md:rounded-[3rem] shadow-2xl p-8 animate-in slide-in-from-top-10 duration-300 mt-10 md:mt-0">
            <h2 className="text-center font-black uppercase text-blue-600 mb-8 tracking-[0.2em] select-none">Configurações</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-4">Nome da Lista</label>
                <input 
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 font-bold outline-none focus:border-blue-500 text-gray-800" 
                  value={editListName} 
                  onChange={e => setEditListName(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-4">Data</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 outline-none font-bold text-gray-800 focus:border-blue-500 focus:bg-white transition-all appearance-none uppercase" 
                    value={editListDate} 
                    onChange={e => setEditListDate(e.target.value)} 
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                 <button onClick={() => setIsEditListModalOpen(false)} className="flex-1 py-5 font-black text-xs uppercase text-gray-400 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors select-none">Cancelar</button>
                 <button onClick={handleUpdateListInfo} className="flex-[2] bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 active:scale-95 transition-all hover:bg-blue-700 select-none">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {productToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-red-900/20 backdrop-blur-sm" onClick={() => setProductToDelete(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-200 select-none">
             <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2 uppercase">Remover Item?</h3>
            <p className="text-gray-500 font-bold mb-6">{productToDelete.name}</p>
            <div className="flex gap-3">
              <button onClick={() => setProductToDelete(null)} className="flex-1 py-4 font-black text-xs uppercase text-gray-400 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors">Não</button>
              <button onClick={confirmDeleteProduct} className="flex-1 py-4 font-black text-xs uppercase text-white bg-red-500 rounded-2xl hover:bg-red-600 shadow-lg shadow-red-200 transition-colors active:scale-95">Sim</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}