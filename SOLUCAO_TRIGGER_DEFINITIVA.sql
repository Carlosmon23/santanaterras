-- ============================================
-- SOLUÇÃO DEFINITIVA PARA O TRIGGER
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- PASSO 1: Verificar o nome exato da coluna
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
AND column_name ILIKE '%atualizacao%';

-- PASSO 2: Remover tudo antigo
DROP TRIGGER IF EXISTS update_imoveis_updated_at ON imoveis;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- PASSO 3: Criar função que detecta automaticamente
-- Esta função vai funcionar independente do nome da coluna
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Tentar atualizar com camelCase primeiro
    BEGIN
        EXECUTE format('SELECT $1.%I', 'dataAtualizacao') USING NEW;
        -- Se chegou aqui, a coluna existe como camelCase
        EXECUTE format('UPDATE %I SET %I = NOW() WHERE id = $1.id', TG_TABLE_NAME, 'dataAtualizacao') USING NEW;
    EXCEPTION WHEN OTHERS THEN
        -- Se falhar, tentar minúsculas
        BEGIN
            EXECUTE format('SELECT $1.%I', 'dataatualizacao') USING NEW;
            EXECUTE format('UPDATE %I SET %I = NOW() WHERE id = $1.id', TG_TABLE_NAME, 'dataatualizacao') USING NEW;
        EXCEPTION WHEN OTHERS THEN
            -- Se ambos falharem, não fazer nada (coluna não existe)
            NULL;
        END;
    END;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- SOLUÇÃO MAIS SIMPLES: Usar diretamente o nome que existe
-- Execute o PASSO 1 primeiro para ver o nome, depois use uma das opções abaixo:

-- OPÇÃO A: Se a coluna for "dataAtualizacao" (camelCase com aspas)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."dataAtualizacao" := NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- OPÇÃO B: Se a coluna for "dataatualizacao" (minúsculas)
-- Descomente e use esta se a OPÇÃO A não funcionar:
/*
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."dataatualizacao" := NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
*/

-- PASSO 4: Recriar o trigger
CREATE TRIGGER update_imoveis_updated_at 
BEFORE UPDATE ON imoveis 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

