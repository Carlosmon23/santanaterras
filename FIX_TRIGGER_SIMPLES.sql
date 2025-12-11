-- ============================================
-- CORRIGIR TRIGGER - SOLUÇÃO SIMPLES
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

-- 3. Criar função que funciona com qualquer nome
-- Primeiro, vamos verificar qual nome existe e criar a função adequada
DO $$
DECLARE
    col_name TEXT;
BEGIN
    -- Verificar qual nome de coluna existe
    SELECT column_name INTO col_name
    FROM information_schema.columns 
    WHERE table_name = 'imoveis' 
    AND (column_name = 'dataAtualizacao' OR column_name = 'dataatualizacao')
    LIMIT 1;
    
    -- Criar função baseada no nome encontrado
    IF col_name = 'dataAtualizacao' THEN
        -- Se for camelCase
        EXECUTE '
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $func$
        BEGIN
            NEW."dataAtualizacao" := NOW();
            RETURN NEW;
        END;
        $func$ language ''plpgsql'';';
    ELSIF col_name = 'dataatualizacao' THEN
        -- Se for minúsculas
        EXECUTE '
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $func$
        BEGIN
            NEW."dataatualizacao" := NOW();
            RETURN NEW;
        END;
        $func$ language ''plpgsql'';';
    ELSE
        -- Se não encontrar, criar como camelCase (padrão)
        EXECUTE '
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $func$
        BEGIN
            NEW."dataAtualizacao" := NOW();
            RETURN NEW;
        END;
        $func$ language ''plpgsql'';';
    END IF;
END $$;

-- 4. Recriar o trigger
CREATE TRIGGER update_imoveis_updated_at 
BEFORE UPDATE ON imoveis 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 5. Verificar se funcionou
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table
FROM information_schema.triggers 
WHERE event_object_table = 'imoveis';

