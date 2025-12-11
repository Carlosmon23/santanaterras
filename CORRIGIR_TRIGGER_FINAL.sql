-- ============================================
-- CORRIGIR TRIGGER - SOLUÇÃO DEFINITIVA
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Verificar o nome exato da coluna
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
AND column_name ILIKE '%atualizacao%';

-- 2. Remover trigger e função antigos
DROP TRIGGER IF EXISTS update_imoveis_updated_at ON imoveis;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 3. Criar função que detecta automaticamente o nome da coluna
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se a coluna existe como "dataAtualizacao" (camelCase)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = TG_TABLE_NAME 
        AND column_name = 'dataAtualizacao'
    ) THEN
        NEW."dataAtualizacao" := NOW();
    -- Se não, usar "dataatualizacao" (minúsculas)
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = TG_TABLE_NAME 
        AND column_name = 'dataatualizacao'
    ) THEN
        NEW."dataatualizacao" := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Recriar o trigger
CREATE TRIGGER update_imoveis_updated_at 
BEFORE UPDATE ON imoveis 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 5. Verificar se funcionou
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'imoveis';

