-- ============================================
-- CORRIGIR TRIGGER - VERSÃO AUTOMÁTICA
-- Execute este script completo no SQL Editor do Supabase
-- Ele detecta automaticamente o nome da coluna
-- ============================================

-- Remover trigger e função antigos
DROP TRIGGER IF EXISTS update_imoveis_updated_at ON imoveis;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Criar função usando bloco DO para detectar o nome da coluna
DO $$
DECLARE
    col_name TEXT;
    sql_func TEXT;
BEGIN
    -- Buscar o nome exato da coluna
    SELECT column_name INTO col_name
    FROM information_schema.columns 
    WHERE table_name = 'imoveis' 
    AND (column_name = 'dataAtualizacao' OR column_name = 'dataatualizacao')
    LIMIT 1;
    
    -- Se não encontrou, usar camelCase como padrão
    IF col_name IS NULL THEN
        col_name := 'dataAtualizacao';
    END IF;
    
    -- Criar a função dinamicamente
    sql_func := format('
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $func$
        BEGIN
            NEW.%I := NOW();
            RETURN NEW;
        END;
        $func$ language ''plpgsql'';', col_name);
    
    EXECUTE sql_func;
    
    RAISE NOTICE 'Função criada usando a coluna: %', col_name;
END $$;

-- Recriar o trigger
CREATE TRIGGER update_imoveis_updated_at 
BEFORE UPDATE ON imoveis 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Verificar resultado
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table
FROM information_schema.triggers 
WHERE event_object_table = 'imoveis';

