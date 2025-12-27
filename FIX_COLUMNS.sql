-- ============================================
-- SCRIPT RÁPIDO PARA ADICIONAR COLUNAS FALTANTES
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Adicionar coluna dataCriacao se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'dataCriacao'
  ) THEN
    ALTER TABLE imoveis ADD COLUMN "dataCriacao" TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE 'Coluna dataCriacao adicionada';
  ELSE
    RAISE NOTICE 'Coluna dataCriacao já existe';
  END IF;
END $$;

-- Adicionar coluna dataAtualizacao se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'dataAtualizacao'
  ) THEN
    ALTER TABLE imoveis ADD COLUMN "dataAtualizacao" TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE 'Coluna dataAtualizacao adicionada';
  ELSE
    RAISE NOTICE 'Coluna dataAtualizacao já existe';
  END IF;
END $$;

-- Adicionar outras colunas que podem estar faltando
DO $$ 
BEGIN
  -- precoExibicao
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'precoExibicao'
  ) THEN
    ALTER TABLE imoveis ADD COLUMN "precoExibicao" TEXT;
    RAISE NOTICE 'Coluna precoExibicao adicionada';
  END IF;
  
  -- areaTotal
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areaTotal'
  ) THEN
    ALTER TABLE imoveis ADD COLUMN "areaTotal" NUMERIC NOT NULL DEFAULT 0;
    RAISE NOTICE 'Coluna areaTotal adicionada';
  END IF;
  
  -- areaUtil
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areaUtil'
  ) THEN
    ALTER TABLE imoveis ADD COLUMN "areaUtil" NUMERIC;
    RAISE NOTICE 'Coluna areaUtil adicionada';
  END IF;
  
  -- fotoCapa
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'fotoCapa'
  ) THEN
    ALTER TABLE imoveis ADD COLUMN "fotoCapa" TEXT;
    RAISE NOTICE 'Coluna fotoCapa adicionada';
  END IF;
END $$;

-- Verificar estrutura final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'imoveis'
ORDER BY ordinal_position;


