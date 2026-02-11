import type { Metadata, Viewport } from "next";

export const siteMetadata: Metadata = {
  title: "Shop List | Gerenciador de Compras Inteligente",
  description: "Organize suas listas de compras, controle quantidades e gerencie seus gastos de forma simples e intuitiva.",
  keywords: ["lista de compras", "organização", "mercado", "gestão de itens", "web shop list"],
  authors: [{ name: "Jonathan" }],
  robots: "index, follow",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
    ],
      shortcut: ['/favicon.ico'],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  manifest: '/site.webmanifest',
};

export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};