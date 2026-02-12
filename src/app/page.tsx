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
    <div className="bg-white text-gray-900 selection:bg-blue-100 overflow-x-hidden font-sans">
      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-8"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic text-gray-900">WebShopList</span>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/jonathaneamorim/web-shop-list" 
              target="_blank" 
              className="hidden md:block font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
            >
              GitHub
            </a>
            <Link href="/app" className="bg-black text-white px-6 py-3 rounded-full font-bold text-xs md:text-sm uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-lg">
              Abrir App
            </Link>
          </div>
        </div>
      </nav>

      <section className="min-h-screen w-full flex flex-col items-center justify-center relative bg-gray-50 pt-20">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse delay-700" />
        
        <div className="relative z-10 w-full text-center px-4 md:px-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] mb-6 shadow-sm">
            V 2.0 • Totalmente Offline
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.95] uppercase mb-8">
            Suas compras,<br />
            <span className="text-blue-600">organizadas.</span>
          </h1>
          <p className="max-w-xl mx-auto text-gray-500 text-base md:text-xl font-medium mb-10 leading-relaxed">
            Pare de usar o WhatsApp como bloco de notas. Tenha listas inteligentes, backup em CSV e privacidade total. Sem login, sem anúncios.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full">
            <Link href="/app" className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 text-center hover:-translate-y-1">
              Começar Agora
            </Link>
            <a href="https://github.com/jonathaneamorim/web-shop-list" target="_blank" className="w-full md:w-auto bg-white text-gray-900 border-2 border-gray-100 px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:border-blue-200 hover:text-blue-600 active:scale-95 transition-all text-center">
              Ver Código
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 animate-bounce hidden md:block opacity-50">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <section className="min-h-screen w-full flex items-center bg-white px-6 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-700 text-center md:text-left">
            <span className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Interface Mobile-First</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight uppercase">
              Projetado para <br/><span className="text-blue-600">uso com uma mão.</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Sabemos como é estar no mercado segurando o carrinho. Nossos modais abrem no topo ou base da tela para facilitar o alcance, e a edição é instantânea.
            </p>
            <ul className="space-y-4 inline-block text-left mt-4">
              {[
                "Modais inteligentes anti-teclado", 
                "Edição rápida ao clicar no item", 
                "Controle fácil de quantidades", 
                "Navegação por gestos naturais"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-gray-700 italic uppercase text-xs md:text-sm">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative p-8 bg-gray-50 rounded-[3rem] border border-gray-100 shadow-inner group transition-all hover:scale-[1.02] animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-100 space-y-4 transform transition-transform group-hover:-translate-y-2">
              <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-4">
                <div className="space-y-2">
                   <div className="w-32 h-6 bg-gray-800 rounded-lg" />
                   <div className="w-20 h-3 bg-gray-200 rounded-md" />
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
              </div>
              
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-gray-50 bg-gray-50/50">
                  <div className={`w-8 h-8 rounded-lg ${i === 1 ? 'bg-green-500 shadow-lg shadow-green-200' : 'border-2 border-gray-200 bg-white'}`} />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute -bottom-6 -right-2 md:-right-6 bg-blue-600 text-white p-4 md:p-6 rounded-[2rem] shadow-2xl shadow-blue-300 font-black uppercase text-[10px] tracking-widest animate-bounce z-20">
              Adicionar Item +
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen w-full flex items-center bg-gray-50 px-6 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 md:order-1 relative p-8 bg-white rounded-[3rem] border border-gray-100 shadow-xl group animate-in fade-in slide-in-from-left-10 duration-700 hover:shadow-2xl transition-all">
            <div className="flex justify-center items-center gap-4 mb-10 mt-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center text-white font-black text-xs uppercase tracking-widest shadow-lg z-10">Você</div>
              <div className="flex-1 h-2 bg-gray-50 rounded-full relative overflow-hidden flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-xl absolute left-0 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50" />
                <div className="w-10 h-10 bg-green-500 rounded-xl absolute left-0 animate-[slide_2.5s_ease-in-out_infinite] flex items-center justify-center text-[8px] text-white font-black shadow-lg border-2 border-white z-20">CSV</div>
                <style jsx>{`
                  @keyframes slide {
                    0% { transform: translateX(0); }
                    50% { transform: translateX(180px); }
                    100% { transform: translateX(180px); opacity: 0; }
                  }
                `}</style>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xs uppercase tracking-widest shadow-lg z-10">Amigo</div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-4 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-sm text-green-500 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              <div>
                <p className="text-gray-900 font-black uppercase text-xs tracking-widest">Backup Exportado</p>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">lista-churrasco.csv</p>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 space-y-8 animate-in fade-in slide-in-from-right-10 duration-700 text-center md:text-left">
            <span className="inline-block bg-green-50 text-green-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Compartilhamento Real</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight uppercase">
              Envie sua lista, <span className="text-green-500">sem depender de nuvem.</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Não salvamos seus dados em servidores. Para compartilhar, basta exportar o arquivo de backup (CSV) e enviar pelo WhatsApp, Telegram ou Email. Simples e privado.
            </p>
            <ul className="space-y-4 inline-block text-left mt-4">
              {["Exportação universal em CSV", "Backup instantâneo de todas as listas", "Importação fácil em outro dispositivo", "Seus dados são seus"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-gray-700 italic uppercase text-xs md:text-sm">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          
          <div className="order-1 md:order-2 space-y-8 text-center md:text-left animate-in fade-in slide-in-from-right-10 duration-1000">
            <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Offline First</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight uppercase">
              Sem internet? <br/><span className="text-blue-200">Sem problemas.</span>
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
              O WebShopList armazena tudo no seu navegador (LocalStorage). Você não precisa criar conta, fazer login ou ter sinal de internet no mercado. Abra e use.
            </p>
            <div className="pt-4">
              <Link href="/app" className="inline-block bg-white text-blue-600 px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95 hover:-translate-y-1">
                Acessar Minhas Listas
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <span className="text-3xl font-black italic tracking-tighter uppercase text-gray-900">WebShopList</span>
            <p className="text-gray-400 mt-2 font-bold text-[10px] uppercase tracking-widest">Simplificando o dia a dia.</p>
          </div>
          
          <div className="text-center md:text-right">
             <a href="https://github.com/jonathaneamorim" target="_blank" className="text-gray-900 font-bold uppercase text-xs tracking-widest hover:text-blue-600 transition-colors">
               Desenvolvido por Jonathan Amorim
             </a>
            <p className="text-gray-400 mt-2 font-medium text-[10px] uppercase tracking-widest">© 2026 Open Source Project</p>
          </div>
        </div>
      </footer>
    </div>
  );
}