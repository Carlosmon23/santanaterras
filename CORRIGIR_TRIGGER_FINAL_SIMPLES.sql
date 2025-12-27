-- ============================================
-- CORRIGIR TRIGGER - VERSÃO FINAL SIMPLES
-- Execute este script completo no SQL Editor do Supabase
-- ============================================

-- 1. Remover trigger e função antigos
DROP TRIGGER IF EXISTS update_imoveis_updated_at ON imoveis;
DROP TRIGGER IF EXISTS update_imoveis_updated ON imoveis;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 2. Criar função usando o nome correto da coluna com aspas duplas
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Usar aspas duplas para preservar o camelCase
    NEW."dataAtualizacao" := NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Recriar o trigger
CREATE TRIGGER update_imoveis_updated_at 
BEFORE UPDATE ON imoveis 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 4. Verificar se funcionou
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table
FROM information_schema.triggers 
WHERE event_object_table = 'imoveis';


