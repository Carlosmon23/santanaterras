-- ============================================
-- CORRIGIR TRIGGER - PASSO A PASSO
-- Execute cada seção separadamente no SQL Editor do Supabase
-- ============================================

-- ============================================
-- PASSO 1: Verificar o nome exato da coluna
-- Execute apenas esta query primeiro e veja o resultado
-- ============================================
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
AND column_name ILIKE '%atualizacao%';

-- ============================================
-- PASSO 2: Remover trigger e função antigos
-- Execute esta seção
-- ============================================
DROP TRIGGER IF EXISTS update_imoveis_updated_at ON imoveis;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================
-- PASSO 3: Criar a função correta
-- Escolha UMA das opções abaixo baseado no resultado do PASSO 1
-- ============================================

-- OPÇÃO A: Se o resultado do PASSO 1 mostrar "dataAtualizacao" (com A maiúsculo)
-- Use esta função:
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."dataAtualizacao" := NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- OPÇÃO B: Se o resultado do PASSO 1 mostrar "dataatualizacao" (tudo minúsculo)
-- Comente a OPÇÃO A acima e use esta:
/*
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."dataatualizacao" := NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
*/

-- ============================================
-- PASSO 4: Recriar o trigger
-- Execute esta seção
-- ============================================
CREATE TRIGGER update_imoveis_updated_at 
BEFORE UPDATE ON imoveis 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PASSO 5: Verificar se funcionou
-- Execute esta query para confirmar
-- ============================================
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table
FROM information_schema.triggers 
WHERE event_object_table = 'imoveis';

