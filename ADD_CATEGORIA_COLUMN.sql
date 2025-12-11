-- ============================================
-- ADICIONAR COLUNA categoria NA TABELA imoveis
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Adicionar coluna categoria
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS categoria TEXT;

-- Criar índice para melhor performance nas buscas
CREATE INDEX IF NOT EXISTS idx_imoveis_categoria ON imoveis(categoria);

-- Atualizar registros existentes com categoria baseada no tipo
UPDATE imoveis 
SET categoria = CASE
  -- Rurais
  WHEN tipo IN ('Sítio', 'Chácara', 'Fazenda', 'Terreno Rural') THEN 'Rural'
  -- Urbanos
  WHEN tipo IN ('Casa', 'Apartamento', 'Sobrado', 'Cobertura', 'Terreno Urbano') THEN 'Urbano'
  -- Comerciais
  WHEN tipo IN ('Sala Comercial', 'Loja', 'Ponto Comercial', 'Galpão Comercial', 'Escritório', 'Terreno Comercial') THEN 'Comercial'
  -- Industriais
  WHEN tipo IN ('Galpão Industrial', 'Terreno Industrial', 'Área Industrial') THEN 'Industrial'
  -- Fallback para tipos antigos
  WHEN tipo = 'Terreno' THEN 'Rural' -- Terreno antigo vira Rural
  ELSE 'Urbano' -- Default para outros tipos antigos
END
WHERE categoria IS NULL;

-- Verificar resultado
SELECT categoria, COUNT(*) as total
FROM imoveis
GROUP BY categoria
ORDER BY categoria;

