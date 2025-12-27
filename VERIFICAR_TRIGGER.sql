-- ============================================
-- VERIFICAR SE O TRIGGER ESTÁ FUNCIONANDO
-- Execute este script para testar
-- ============================================

-- 1. Ver o código da função do trigger
SELECT 
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'update_updated_at_column';

-- 2. Ver detalhes do trigger
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'imoveis';

-- 3. Verificar o nome exato da coluna dataAtualizacao
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
AND column_name ILIKE '%atualizacao%';

-- 4. Testar o trigger (opcional - descomente para testar)
-- UPDATE imoveis SET titulo = titulo WHERE id = (SELECT id FROM imoveis LIMIT 1);
-- SELECT "dataAtualizacao" FROM imoveis LIMIT 1;


