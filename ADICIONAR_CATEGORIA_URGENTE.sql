-- ============================================
-- ADICIONAR COLUNA CATEGORIA - URGENTE
-- Execute este script AGORA no SQL Editor do Supabase
-- ============================================

-- 1. Adicionar coluna categoria
ALTER TABLE imoveis 
ADD COLUMN IF NOT EXISTS categoria TEXT;

-- 2. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_imoveis_categoria ON imoveis(categoria);

-- 3. Popular categorias existentes baseado no tipo
UPDATE imoveis 
SET categoria = CASE
    WHEN tipo IN ('Sítio', 'Chácara', 'Fazenda', 'Terreno Rural') THEN 'Rural'
    WHEN tipo IN ('Casa', 'Apartamento', 'Sobrado', 'Cobertura', 'Terreno Urbano') THEN 'Urbano'
    WHEN tipo IN ('Sala Comercial', 'Loja', 'Ponto Comercial', 'Galpão Comercial', 'Escritório', 'Terreno Comercial') THEN 'Comercial'
    WHEN tipo IN ('Galpão Industrial', 'Terreno Industrial', 'Área Industrial') THEN 'Industrial'
    ELSE 'Urbano'
END
WHERE categoria IS NULL;

-- 4. Verificar se funcionou
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
AND column_name = 'categoria';


