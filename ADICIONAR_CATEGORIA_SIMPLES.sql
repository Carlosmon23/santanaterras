-- ============================================
-- ADICIONAR COLUNA CATEGORIA - VERSÃO SIMPLES
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Adicionar coluna categoria se não existir
ALTER TABLE imoveis 
ADD COLUMN IF NOT EXISTS categoria TEXT;

-- 2. Definir valores padrão para imóveis existentes baseado no tipo
UPDATE imoveis 
SET categoria = CASE
    WHEN tipo IN ('Sítio', 'Chácara', 'Fazenda', 'Terreno Rural') THEN 'Rural'
    WHEN tipo IN ('Casa', 'Apartamento', 'Sobrado', 'Cobertura', 'Terreno Urbano') THEN 'Urbano'
    WHEN tipo IN ('Sala Comercial', 'Loja', 'Ponto Comercial', 'Galpão Comercial', 'Escritório', 'Terreno Comercial') THEN 'Comercial'
    WHEN tipo IN ('Galpão Industrial', 'Terreno Industrial', 'Área Industrial') THEN 'Industrial'
    ELSE 'Urbano' -- Padrão para tipos antigos
END
WHERE categoria IS NULL;

-- 3. Tornar a coluna obrigatória (após popular os dados existentes)
ALTER TABLE imoveis 
ALTER COLUMN categoria SET NOT NULL;

-- 4. Adicionar valor padrão para novos registros
ALTER TABLE imoveis 
ALTER COLUMN categoria SET DEFAULT 'Urbano';

-- 5. Verificar se funcionou
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
AND column_name = 'categoria';

-- 6. Ver quantos imóveis foram categorizados
SELECT categoria, COUNT(*) as total
FROM imoveis
GROUP BY categoria;


