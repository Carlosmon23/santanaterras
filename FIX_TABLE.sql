-- ============================================
-- SCRIPT PARA CORRIGIR A TABELA imoveis
-- Execute este script se receber erro de coluna não encontrada
-- ============================================

-- Primeiro, vamos verificar se a tabela existe e quais colunas tem
-- (Execute isso no SQL Editor para ver a estrutura atual)

-- Se a tabela não existe, crie ela:
CREATE TABLE IF NOT EXISTS imoveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Rascunho',
  preco NUMERIC,
  "precoExibicao" TEXT,
  localizacao JSONB NOT NULL DEFAULT '{"cidade": "", "bairro": "", "estado": ""}',
  "areaTotal" NUMERIC NOT NULL,
  "areaUtil" NUMERIC,
  caracteristicas JSONB NOT NULL DEFAULT '{"quartos": 0, "suites": 0, "banheiros": 0}',
  comodidades TEXT[] DEFAULT '{}',
  descricao TEXT NOT NULL,
  fotos TEXT[] DEFAULT '{}',
  "fotoCapa" TEXT,
  destaque BOOLEAN DEFAULT false,
  visualizacoes INTEGER DEFAULT 0,
  slug TEXT NOT NULL,
  "dataCriacao" TIMESTAMPTZ DEFAULT NOW(),
  "dataAtualizacao" TIMESTAMPTZ DEFAULT NOW()
);

-- Se a tabela já existe mas falta a coluna dataCriacao, adicione:
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'dataCriacao'
  ) THEN
    ALTER TABLE imoveis ADD COLUMN "dataCriacao" TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Se falta a coluna dataAtualizacao, adicione:
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'dataAtualizacao'
  ) THEN
    ALTER TABLE imoveis ADD COLUMN "dataAtualizacao" TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Verificar outras colunas que podem estar faltando
DO $$ 
BEGIN
  -- precoExibicao
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'precoExibicao'
  ) THEN
    ALTER TABLE imoveis ADD COLUMN "precoExibicao" TEXT;
  END IF;
  
  -- areaTotal
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areaTotal'
  ) THEN
    ALTER TABLE imoveis ADD COLUMN "areaTotal" NUMERIC NOT NULL DEFAULT 0;
  END IF;
  
  -- areaUtil
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areaUtil'
  ) THEN
    ALTER TABLE imoveis ADD COLUMN "areaUtil" NUMERIC;
  END IF;
  
  -- fotoCapa
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'fotoCapa'
  ) THEN
    ALTER TABLE imoveis ADD COLUMN "fotoCapa" TEXT;
  END IF;
END $$;

-- Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_imoveis_status ON imoveis(status);
CREATE INDEX IF NOT EXISTS idx_imoveis_destaque ON imoveis(destaque);
CREATE INDEX IF NOT EXISTS idx_imoveis_slug ON imoveis(slug);
CREATE INDEX IF NOT EXISTS idx_imoveis_tipo ON imoveis(tipo);
CREATE INDEX IF NOT EXISTS idx_imoveis_dataCriacao ON imoveis("dataCriacao" DESC);

-- ============================================
-- VERIFICAÇÃO FINAL
-- Execute este SELECT para ver todas as colunas da tabela:
-- ============================================
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'imoveis'
-- ORDER BY ordinal_position;


