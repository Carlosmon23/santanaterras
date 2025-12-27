-- ============================================
-- VERIFICAR ESTRUTURA DA TABELA
-- Execute este script para ver todas as colunas
-- ============================================

SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'imoveis'
ORDER BY ordinal_position;

-- Se a coluna estiver como "areatotal" (minúsculas), vamos renomeá-la
DO $$ 
BEGIN
  -- Verificar se existe como "areatotal" (minúsculas)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areatotal'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areaTotal'
  ) THEN
    ALTER TABLE imoveis RENAME COLUMN "areatotal" TO "areaTotal";
    RAISE NOTICE 'Coluna renomeada de areatotal para areaTotal';
  END IF;
END $$;

-- Verificar novamente
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
AND column_name LIKE '%area%';


