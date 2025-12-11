# Script para fazer upload no GitHub
# Execute este script no PowerShell

Write-Host "🚀 Preparando upload para GitHub..." -ForegroundColor Green

# Navegar para o diretório do projeto
$projectPath = "C:\Users\carlo\Desktop\Santana - Trae"
Set-Location $projectPath

Write-Host "📁 Diretório: $projectPath" -ForegroundColor Cyan

# Remover lock file se existir
if (Test-Path "C:\Users\carlo\.git\index.lock") {
    Write-Host "🔓 Removendo arquivo de lock..." -ForegroundColor Yellow
    Remove-Item -Path "C:\Users\carlo\.git\index.lock" -Force -ErrorAction SilentlyContinue
}

# Verificar se já existe .git no diretório do projeto
if (Test-Path ".git") {
    Write-Host "⚠️  Repositório Git já existe. Continuando..." -ForegroundColor Yellow
} else {
    Write-Host "📦 Inicializando repositório Git..." -ForegroundColor Cyan
    git init
}

Write-Host "➕ Adicionando arquivos..." -ForegroundColor Cyan
git add .

Write-Host "💾 Fazendo commit..." -ForegroundColor Cyan
git commit -m "Initial commit: Santana Terras - Site completo com Supabase, compressão de imagens e todas as funcionalidades"

Write-Host "🌿 Configurando branch main..." -ForegroundColor Cyan
git branch -M main

Write-Host "🔗 Adicionando repositório remoto..." -ForegroundColor Cyan
git remote remove origin -ErrorAction SilentlyContinue
git remote add origin https://github.com/Carlosmon23/santanaterras.git

Write-Host "⬆️  Fazendo upload para GitHub..." -ForegroundColor Cyan
Write-Host "⚠️  Se pedir autenticação, use seu Personal Access Token do GitHub" -ForegroundColor Yellow
git push -u origin main

Write-Host "✅ Concluído! Verifique em: https://github.com/Carlosmon23/santanaterras" -ForegroundColor Green

