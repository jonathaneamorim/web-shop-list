import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-white">
      <h1 className="text-4xl font-black text-black italic">SHOP HELPER</h1>
      <p className="text-gray-500 mb-8">Organize suas listas localmente.</p>
      <Link href="/app" className="bg-black text-white px-8 py-4 rounded-full font-bold">
        COMEÇAR
      </Link>
    </main>
  );
}