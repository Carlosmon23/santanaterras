-- ============================================
-- SCRIPT SIMPLES E DIRETO
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Adicionar todas as colunas que podem estar faltando
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS "dataCriacao" TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS "dataAtualizacao" TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS "precoExibicao" TEXT;
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS "areaTotal" NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS "areaUtil" NUMERIC;
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS "fotoCapa" TEXT;

-- Verificar se todas as colunas existem
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'imoveis'
ORDER BY column_name;

