-- ============================================
-- CORRIGIR FUNÇÃO TRIGGER PARA dataAtualizacao
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Primeiro, verificar como a coluna está nomeada
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
AND column_name ILIKE '%data%'
ORDER BY column_name;

-- Corrigir a função trigger para usar o nome correto da coluna
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Tentar atualizar com ambos os nomes possíveis
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'imoveis' AND column_name = 'dataAtualizacao'
    ) THEN
        NEW."dataAtualizacao" = NOW();
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'imoveis' AND column_name = 'dataatualizacao'
    ) THEN
        NEW."dataatualizacao" = NOW();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- OU, mais simples: usar o nome exato como está no banco
-- Se a coluna está como "dataatualizacao" (minúsculas), use:
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar qual nome de coluna existe e atualizar
    IF TG_TABLE_NAME = 'imoveis' THEN
        -- Tentar atualizar com aspas para preservar camelCase
        BEGIN
            EXECUTE format('SELECT $1.%I', 'dataAtualizacao') USING NEW;
            EXECUTE format('UPDATE %I SET %I = NOW() WHERE id = $1.id', TG_TABLE_NAME, 'dataAtualizacao') USING NEW;
        EXCEPTION WHEN OTHERS THEN
            -- Se falhar, tentar minúsculas
            EXECUTE format('UPDATE %I SET %I = NOW() WHERE id = $1.id', TG_TABLE_NAME, 'dataatualizacao') USING NEW;
        END;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Solução mais simples e direta:
-- Recriar a função usando o nome exato da coluna
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Usar o nome exato como está no banco (com aspas para camelCase)
    NEW."dataAtualizacao" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Se ainda der erro, verificar o nome exato e usar:
-- NEW."dataatualizacao" = NOW(); -- se for minúsculas
-- ou
-- NEW."dataAtualizacao" = NOW(); -- se for camelCase

-- Recriar o trigger
DROP TRIGGER IF EXISTS update_imoveis_updated_at ON imoveis;

CREATE TRIGGER update_imoveis_updated_at 
BEFORE UPDATE ON imoveis 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();


