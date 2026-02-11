# WebShopList 🛒

WebShopList é um gerenciador de listas de compras inteligente, rápido e focado em privacidade, desenvolvido para funcionar diretamente no seu navegador.
Aplicação: [Link](https://web-shop-list.vercel.app/)

## 🔴 O Problema

Ir ao mercado muitas vezes resulta em esquecer itens importantes, comprar coisas desnecessárias ou se perder em aplicativos de notas genéricos que não foram feitos para gerenciar compras. Além disso, a maioria dos aplicativos de listas de compras exige a criação de contas, login, dependência de internet e armazena seus dados em servidores de terceiros, comprometendo a sua privacidade e agilidade. Compartilhar uma lista geralmente força a outra pessoa a baixar o mesmo aplicativo e criar uma conta.

## 🟢 A Solução

O **WebShopList** resolve isso oferecendo uma experiência focada, offline-first e livre de burocracias. É uma aplicação web moderna que permite criar e gerenciar suas listas de supermercado com controle total de itens e quantidades, tudo salvo localmente no seu dispositivo.

Sem logins. Sem carregamentos demorados. Sem rastreamento de dados. 

Para compartilhar uma lista com alguém (como um familiar que vai ao mercado), o projeto inova ao utilizar a **exportação e importação via arquivos CSV**. Você gera o arquivo, envia por WhatsApp ou e-mail, e a outra pessoa simplesmente importa no dispositivo dela, garantindo que o compartilhamento seja totalmente descentralizado e seguro.

## ✨ Funcionalidades

- **Gestão de Listas:** Crie, edite e exclua listas de compras para diferentes ocasiões (ex: Rancho do Mês, Churrasco, Hortifruti).
- **Controle de Itens:** Adicione produtos informando nome e quantidade através de uma interface modal otimizada para uso com apenas uma mão no celular.
- **Acompanhamento em Tempo Real:** Marque produtos individuais ou a lista inteira como "Concluída".
- **Privacidade Absoluta (Offline-First):** Todos os dados são armazenados no `localStorage` do seu navegador. Nada vai para a nuvem.
- **Backup e Compartilhamento via CSV:** Exporte todo o seu histórico e listas ativas para um arquivo CSV e importe em qualquer outro dispositivo.
- **Mobile-First:** Interface responsiva, com botões e modais desenhados para a melhor experiência em telas sensíveis ao toque.

## 🛠️ Tecnologias Utilizadas

- **[Next.js](https://nextjs.org/)** (App Router)
- **[React](https://reactjs.org/)**
- **[Tailwind CSS](https://tailwindcss.com/)** para estilização rápida e responsiva
- **[TypeScript](https://www.typescriptlang.org/)** para tipagem estática e segurança do código
- **LocalStorage API** para persistência de dados no cliente

## 🚀 Como Executar o Projeto Localmente

1. Clone este repositório:
```bash
git clone https://github.com/jonathaneamorim/web-shop-list.git
```

2. Acesse a pasta do projeto:
```bash
cd webshoplist
```

3. Instale as dependências:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.