# Santana Terras - Site de Imóveis

Site de imóveis rurais e urbanos desenvolvido com React, TypeScript, Vite e Supabase.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Supabase** - Backend (Banco de dados, Autenticação, Storage)
- **Tailwind CSS** - Framework CSS
- **Zustand** - Gerenciamento de estado
- **React Router** - Roteamento

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou pnpm
- Conta no Supabase

## 🔧 Instalação

1. **Clone o repositório:**
   ```bash
   git clone <seu-repositorio>
   cd santana-terras
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` e adicione suas credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon
   ```

4. **Execute o script SQL no Supabase:**
   - Acesse o SQL Editor do Supabase
   - Execute o arquivo `SUPABASE_SQL.sql`
   - Execute `ADICIONAR_CATEGORIA_URGENTE.sql` para adicionar a coluna categoria
   - Execute `CORRIGIR_TRIGGER_FINAL_SIMPLES.sql` para corrigir o trigger

5. **Configure o Storage no Supabase:**
   - Crie um bucket chamado `imoveis`
   - Configure as políticas de acesso (veja `SUPABASE_SETUP.md`)

6. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run client:dev
   # ou
   pnpm client:dev
   ```

## 🏗️ Scripts Disponíveis

- `npm run client:dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/          # Páginas da aplicação
├── stores/         # Stores Zustand (estado global)
├── types/          # Tipos TypeScript
├── utils/          # Funções utilitárias
├── config/         # Arquivos de configuração (logo, hero images)
└── lib/            # Bibliotecas e clientes (Supabase)
```

## 🔐 Variáveis de Ambiente

As seguintes variáveis devem estar configuradas:

- `VITE_SUPABASE_URL` - URL do seu projeto Supabase
- `VITE_SUPABASE_ANON_KEY` - Chave anônima do Supabase

## 🚀 Deploy na Vercel

1. **Conecte o repositório à Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Importe o projeto do GitHub
   - Configure as variáveis de ambiente na Vercel

2. **Build Settings (automático):**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Deploy automático:**
   - A Vercel fará deploy automaticamente a cada push na branch principal

## 📝 Documentação Adicional

- `SUPABASE_SETUP.md` - Guia completo de configuração do Supabase
- `DEPLOY_VERCEL.md` - Instruções detalhadas de deploy

## 👤 Admin

- Acesse `/admin/login` para fazer login
- Crie um usuário no Supabase Authentication primeiro

## 📄 Licença

Este projeto é privado e proprietário da Santana Terras.
