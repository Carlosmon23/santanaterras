# Como Atualizar o Site na Vercel

## Opção 1: Deploy Automático via Git (Recomendado)

Se o projeto já está conectado ao Git e à Vercel:

1. **Faça commit das alterações:**
   ```bash
   git add .
   git commit -m "Atualizações: remove referências Trae, ajusta hero section, adiciona compressão de imagens"
   git push
   ```

2. **A Vercel fará o deploy automaticamente** quando você fizer push para a branch principal (geralmente `main` ou `master`).

## Opção 2: Deploy Manual via Vercel CLI

### Instalar Vercel CLI (se ainda não tiver):
```bash
npm install -g vercel
```

### Fazer login na Vercel:
```bash
vercel login
```

### Fazer deploy:
```bash
# Deploy para produção
vercel --prod

# Ou apenas deploy de preview
vercel
```

## Opção 3: Deploy via Dashboard da Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Vá até o projeto "Santana Terras"
3. Clique em **"Deployments"**
4. Clique em **"Redeploy"** no último deployment
5. Ou faça upload do código via **"Import Project"**

## Configurações Importantes

### Variáveis de Ambiente
Certifique-se de que as seguintes variáveis estão configuradas na Vercel:

1. Acesse: **Settings** → **Environment Variables**
2. Adicione/Verifique:
   - `VITE_SUPABASE_URL` = `https://alnyrhzrhsepweapunwx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Build Settings
A Vercel deve detectar automaticamente:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install` (ou `pnpm install` se usar pnpm)

## Verificar o Deploy

Após o deploy, verifique:
1. ✅ Site carrega corretamente
2. ✅ Logo aparece (verifique a URL no `src/config/logo.ts`)
3. ✅ Imagens do hero aparecem (verifique URLs no `src/config/heroImages.ts`)
4. ✅ Conexão com Supabase funciona
5. ✅ Login admin funciona

## Troubleshooting

### Se o build falhar:
- Verifique os logs na Vercel
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se as variáveis de ambiente estão configuradas

### Se as imagens não aparecerem:
- Verifique se as URLs no `src/config/heroImages.ts` e `src/config/logo.ts` estão corretas
- Certifique-se de que as imagens foram enviadas para o Supabase Storage

### Se houver erro de CORS:
- Verifique as configurações do Supabase
- Certifique-se de que o domínio da Vercel está permitido no Supabase


