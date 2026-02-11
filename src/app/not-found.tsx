import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-gray-50 text-gray-900 selection:bg-blue-100 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-10 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse delay-700" />
      
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter leading-none uppercase mb-4 text-blue-600">
          404
        </h1>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-6 leading-tight">
          Página não <br className="md:hidden" /> encontrada.
        </h2>
        <p className="max-w-md mx-auto text-gray-500 text-base md:text-lg font-medium mb-10 leading-relaxed">
          Parece que você se perdeu no corredor errado do mercado. O que você procura não está aqui.
        </p>
        <div className="flex justify-center w-full">
          <Link href="/" className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 text-center">
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}