"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white text-gray-900 selection:bg-blue-100 overflow-x-hidden">
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-8"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">WebShopList</span>
          <Link href="/app" className="bg-black text-white px-6 py-3 rounded-full font-bold text-xs md:text-sm uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
            Abrir App
          </Link>
        </div>
      </nav>

      <section className="min-h-screen w-full flex flex-col items-center justify-center relative bg-gray-50 pt-20">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse delay-700" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.95] uppercase mb-8">
            Suas compras,<br />
            <span className="text-blue-600">organizadas.</span>
          </h1>
          <p className="max-w-xl mx-auto text-gray-500 text-base md:text-xl font-medium mb-10 leading-relaxed">
            A maneira mais inteligente e rápida de gerenciar suas listas de mercado. Totalmente offline, seguro e gratuito.
          </p>
          <div className="flex justify-center w-full">
            <Link href="/app" className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 text-center">
              Começar Agora
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 animate-bounce hidden md:block">
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <section className="min-h-screen w-full flex items-center bg-white px-6 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-700 text-center md:text-left">
            <span className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Controle Total</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight uppercase">
              Gerencie seus itens com <span className="text-blue-600">agilidade.</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Crie listas específicas para cada ocasião. Nosso sistema de modais intuitivos permite adicionar produtos e quantidades sem perder tempo.
            </p>
            <ul className="space-y-4 inline-block text-left">
              {["Criação dinâmica de listas", "Edição em tempo real", "Controle de quantidades", "Interface focada em UX mobile"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-gray-700 italic uppercase text-xs md:text-sm">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative p-8 bg-gray-50 rounded-[3rem] border border-gray-100 shadow-inner group transition-all hover:scale-[1.02] animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-100 space-y-4 transform transition-transform group-hover:-translate-y-2">
              <div className="flex justify-between items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl animate-pulse" />
                <div className="w-24 h-4 bg-gray-100 rounded-full" />
              </div>
              <div className="h-4 w-full bg-gray-50 rounded-full" />
              <div className="h-4 w-3/4 bg-gray-50 rounded-full" />
              <div className="pt-6 flex gap-3">
                <div className="h-12 flex-1 bg-blue-50 rounded-xl" />
                <div className="h-12 flex-1 bg-blue-600 rounded-xl shadow-lg shadow-blue-200" />
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-2 md:-right-6 bg-green-500 text-white p-4 md:p-6 rounded-[2rem] shadow-2xl font-black uppercase text-[10px] tracking-widest animate-bounce z-20">
              Lista Concluída!
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen w-full flex items-center bg-blue-600 text-white overflow-hidden relative py-20">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-4 md:grid-cols-8 h-full">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="border border-white/20 h-32" />
            ))}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="order-2 md:order-1 flex justify-center animate-in fade-in slide-in-from-left-10 duration-1000 delay-200">
            <div className="bg-white/10 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] border border-white/20 shadow-2xl hover:bg-white/20 transition-colors">
              <svg className="w-24 h-24 md:w-40 md:h-40 text-blue-100 drop-shadow-2xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
          </div>
          
          <div className="order-1 md:order-2 space-y-8 text-center md:text-left animate-in fade-in slide-in-from-right-10 duration-1000">
            <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Backup & Segurança</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight uppercase">
              Seus dados <span className="text-blue-200">sempre com você.</span>
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
              Exporte suas listas completas (incluindo produtos e quantidades) para arquivos CSV. Importe em qualquer dispositivo e nunca perca seu histórico de compras.
            </p>
            <Link href="/app" className="inline-block bg-white text-blue-600 px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95">
              Testar Agora
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <span className="text-3xl font-black italic tracking-tighter uppercase">WebShopList</span>
          <div className="text-center md:text-right">
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">© 2026 WebShopList Project</p>
            <p className="text-gray-600 mt-2 font-medium text-xs">Design focado em performance e simplicidade.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}