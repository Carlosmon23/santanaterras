# Instruções para Fazer Upload no GitHub

Siga estes passos no terminal PowerShell (abra como Administrador se necessário):

## 1. Navegue até o diretório do projeto:
```powershell
cd "C:\Users\carlo\Desktop\Santana - Trae"
```

## 2. Remova o arquivo de lock (se existir):
```powershell
Remove-Item -Path "C:\Users\carlo\.git\index.lock" -Force -ErrorAction SilentlyContinue
```

## 3. Inicialize o Git no diretório correto:
```powershell
git init
```

## 4. Adicione todos os arquivos:
```powershell
git add .
```

## 5. Faça o commit inicial:
```powershell
git commit -m "Initial commit: Santana Terras - Site completo com Supabase, compressão de imagens e todas as funcionalidades"
```

## 6. Renomeie a branch para main:
```powershell
git branch -M main
```

## 7. Adicione o repositório remoto:
```powershell
git remote add origin https://github.com/Carlosmon23/santanaterras.git
```

## 8. Faça o push:
```powershell
git push -u origin main
```

## Se der erro de autenticação:

Se pedir usuário e senha, você pode:

**Opção A - Usar Personal Access Token:**
1. Vá em GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Crie um novo token com permissão `repo`
3. Use o token como senha quando pedir

**Opção B - Usar GitHub CLI:**
```powershell
# Instalar GitHub CLI (se não tiver)
winget install GitHub.cli

# Fazer login
gh auth login

# Depois fazer o push normalmente
git push -u origin main
```

## Verificar se funcionou:

Após o push, acesse: https://github.com/Carlosmon23/santanaterras

Você deve ver todos os arquivos do projeto lá!


