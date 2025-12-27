-- Adicionar coluna unidade_area na tabela imoveis
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS unidade_area TEXT DEFAULT 'm²';

-- Atualizar registros existentes para 'm²' (padrão)
UPDATE imoveis SET unidade_area = 'm²' WHERE unidade_area IS NULL;
