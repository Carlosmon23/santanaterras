-- ============================================
-- CORRIGIR PROBLEMA COM areaTotal
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Primeiro, vamos ver como a coluna está nomeada
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
AND (column_name ILIKE '%area%' OR column_name ILIKE '%Area%');

-- Se a coluna estiver como "areatotal" (minúsculas sem aspas), vamos renomeá-la
DO $$ 
BEGIN
  -- Verificar se existe como "areatotal" (minúsculas)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areatotal'
  ) THEN
    -- Renomear para areaTotal (com aspas para preservar camelCase)
    ALTER TABLE imoveis RENAME COLUMN areatotal TO "areaTotal";
    RAISE NOTICE 'Coluna renomeada de areatotal para areaTotal';
  END IF;
  
  -- Se não existir nenhuma versão, criar
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' 
    AND (column_name = 'areaTotal' OR column_name = 'areatotal')
  ) THEN
    ALTER TABLE imoveis ADD COLUMN "areaTotal" NUMERIC NOT NULL DEFAULT 0;
    RAISE NOTICE 'Coluna areaTotal criada';
  END IF;
END $$;

-- Verificar resultado final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
AND column_name ILIKE '%area%'
ORDER BY column_name;


