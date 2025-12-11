-- ============================================
-- TESTAR SE O TRIGGER ESTÁ FUNCIONANDO
-- Execute este script para verificar
-- ============================================

-- 1. Ver a definição completa da função
SELECT 
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'update_updated_at_column';

-- 2. Verificar o nome exato da coluna
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
AND column_name ILIKE '%atualizacao%';

-- 3. Se a coluna for "dataAtualizacao" (camelCase), o trigger deve funcionar
-- Se for "dataatualizacao" (minúsculas), precisamos ajustar

