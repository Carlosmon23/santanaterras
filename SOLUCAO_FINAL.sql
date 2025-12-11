-- ============================================
-- SOLUÇÃO FINAL - Verificar e Corrigir
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Ver TODAS as colunas da tabela imoveis
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'imoveis'
ORDER BY column_name;

-- 2. Verificar especificamente colunas relacionadas a "area"
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
AND (column_name ILIKE '%area%');

-- 3. Se existir "areatotal" (minúsculas) E "areaTotal" (camelCase), 
--    vamos remover a minúscula e manter apenas a camelCase
DO $$ 
BEGIN
  -- Se existir "areatotal" (minúsculas) e também "areaTotal"
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areatotal'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areaTotal'
  ) THEN
    -- Remover a coluna minúscula (depois de migrar dados se necessário)
    ALTER TABLE imoveis DROP COLUMN IF EXISTS areatotal;
    RAISE NOTICE 'Coluna duplicada areatotal removida';
  -- Se existir apenas "areatotal" (minúsculas), renomear
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areatotal'
  ) THEN
    ALTER TABLE imoveis RENAME COLUMN areatotal TO "areaTotal";
    RAISE NOTICE 'Coluna renomeada de areatotal para areaTotal';
  END IF;
END $$;

-- 4. Garantir que a coluna areaTotal existe e tem valor padrão
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'areaTotal'
  ) THEN
    ALTER TABLE imoveis ADD COLUMN "areaTotal" NUMERIC NOT NULL DEFAULT 0;
    RAISE NOTICE 'Coluna areaTotal criada';
  ELSE
    -- Atualizar constraint para permitir NULL temporariamente, depois voltar
    ALTER TABLE imoveis ALTER COLUMN "areaTotal" SET DEFAULT 0;
    -- Se houver valores NULL, atualizar para 0
    UPDATE imoveis SET "areaTotal" = 0 WHERE "areaTotal" IS NULL;
    -- Garantir NOT NULL
    ALTER TABLE imoveis ALTER COLUMN "areaTotal" SET NOT NULL;
    RAISE NOTICE 'Coluna areaTotal atualizada com sucesso';
  END IF;
END $$;

-- 5. Verificar resultado final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
AND column_name ILIKE '%area%'
ORDER BY column_name;

