-- ============================================
-- SOLUÇÃO DEFINITIVA PARA O TRIGGER
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Verificar o nome exato da coluna
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
AND column_name ILIKE '%atualizacao%'
ORDER BY column_name;

-- 2. Remover função e trigger antigos
DROP TRIGGER IF EXISTS update_imoveis_updated_at ON imoveis;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 3. Criar função que funciona com ambos os nomes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
DECLARE
    col_name TEXT;
BEGIN
    -- Verificar qual nome de coluna existe
    SELECT column_name INTO col_name
    FROM information_schema.columns 
    WHERE table_name = TG_TABLE_NAME 
    AND (column_name = 'dataAtualizacao' OR column_name = 'dataatualizacao')
    LIMIT 1;
    
    -- Atualizar usando o nome encontrado
    IF col_name = 'dataAtualizacao' THEN
        NEW."dataAtualizacao" := NOW();
    ELSIF col_name = 'dataatualizacao' THEN
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

-- 5. Testar (opcional - descomente para testar)
-- UPDATE imoveis SET titulo = titulo WHERE id = (SELECT id FROM imoveis LIMIT 1);
-- SELECT "dataAtualizacao" FROM imoveis LIMIT 1;


