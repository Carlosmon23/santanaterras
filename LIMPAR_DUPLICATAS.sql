-- ============================================
-- LIMPAR COLUNAS DUPLICADAS
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Ver TODAS as colunas para identificar duplicatas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'imoveis'
ORDER BY LOWER(column_name), column_name;

-- 2. Remover coluna duplicada areautil (minúsculas)
-- ATENÇÃO: Se houver dados importantes na coluna minúscula, migre primeiro!
DO $$ 
BEGIN
  -- Se existir areautil (minúsculas) e também areaUtil (camelCase)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areautil'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areaUtil'
  ) THEN
    -- Migrar dados da minúscula para camelCase (se houver dados)
    UPDATE imoveis 
    SET "areaUtil" = areautil 
    WHERE areautil IS NOT NULL AND "areaUtil" IS NULL;
    
    -- Remover a coluna minúscula
    ALTER TABLE imoveis DROP COLUMN areautil;
    RAISE NOTICE 'Coluna duplicada areautil removida (dados migrados para areaUtil)';
  -- Se existir apenas areautil (minúsculas), renomear
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areautil'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areaUtil'
  ) THEN
    ALTER TABLE imoveis RENAME COLUMN areautil TO "areaUtil";
    RAISE NOTICE 'Coluna renomeada de areautil para areaUtil';
  END IF;
END $$;

-- 3. Verificar e corrigir outras possíveis duplicatas
DO $$ 
BEGIN
  -- Verificar areatotal (minúsculas) vs areaTotal (camelCase)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areatotal'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areaTotal'
  ) THEN
    -- Migrar dados
    UPDATE imoveis 
    SET "areaTotal" = areatotal 
    WHERE areatotal IS NOT NULL AND "areaTotal" IS NULL;
    
    ALTER TABLE imoveis DROP COLUMN areatotal;
    RAISE NOTICE 'Coluna duplicada areatotal removida';
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areatotal'
  ) THEN
    ALTER TABLE imoveis RENAME COLUMN areatotal TO "areaTotal";
    RAISE NOTICE 'Coluna renomeada de areatotal para areaTotal';
  END IF;
  
  -- Verificar outras possíveis duplicatas com camelCase
  -- precoexibicao vs precoExibicao
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'precoexibicao'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'precoExibicao'
  ) THEN
    UPDATE imoveis SET "precoExibicao" = precoexibicao WHERE precoexibicao IS NOT NULL;
    ALTER TABLE imoveis DROP COLUMN precoexibicao;
    RAISE NOTICE 'Coluna duplicada precoexibicao removida';
  END IF;
  
  -- fotocapa vs fotoCapa
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'fotocapa'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'fotoCapa'
  ) THEN
    UPDATE imoveis SET "fotoCapa" = fotocapa WHERE fotocapa IS NOT NULL;
    ALTER TABLE imoveis DROP COLUMN fotocapa;
    RAISE NOTICE 'Coluna duplicada fotocapa removida';
  END IF;
  
  -- datacriacao vs dataCriacao
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'datacriacao'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'dataCriacao'
  ) THEN
    UPDATE imoveis SET "dataCriacao" = datacriacao WHERE datacriacao IS NOT NULL;
    ALTER TABLE imoveis DROP COLUMN datacriacao;
    RAISE NOTICE 'Coluna duplicada datacriacao removida';
  END IF;
  
  -- dataatualizacao vs dataAtualizacao
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'dataatualizacao'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'dataAtualizacao'
  ) THEN
    UPDATE imoveis SET "dataAtualizacao" = dataatualizacao WHERE dataatualizacao IS NOT NULL;
    ALTER TABLE imoveis DROP COLUMN dataatualizacao;
    RAISE NOTICE 'Coluna duplicada dataatualizacao removida';
  END IF;
END $$;

-- 4. Verificar resultado final - todas as colunas devem estar em camelCase
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'imoveis'
ORDER BY column_name;

-- 5. Verificar especificamente colunas que devem estar em camelCase
SELECT column_name
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
AND (
  column_name = 'areatotal' OR 
  column_name = 'areautil' OR
  column_name = 'precoexibicao' OR
  column_name = 'fotocapa' OR
  column_name = 'datacriacao' OR
  column_name = 'dataatualizacao'
);

-- Se retornar alguma linha acima, ainda há colunas minúsculas que precisam ser corrigidas

