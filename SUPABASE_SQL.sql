-- ============================================
-- CONFIGURAÇÃO COMPLETA DO SUPABASE
-- Cole este arquivo no SQL Editor do Supabase
-- ============================================

-- ============================================
-- 1. CRIAR TABELA: imoveis
-- ============================================
CREATE TABLE IF NOT EXISTS imoveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Rascunho',
  preco NUMERIC,
  "precoExibicao" TEXT,
  localizacao JSONB NOT NULL DEFAULT '{"cidade": "", "bairro": "", "estado": ""}',
  "areaTotal" NUMERIC NOT NULL,
  "areaUtil" NUMERIC,
  caracteristicas JSONB NOT NULL DEFAULT '{"quartos": 0, "suites": 0, "banheiros": 0}',
  comodidades TEXT[] DEFAULT '{}',
  descricao TEXT NOT NULL,
  fotos TEXT[] DEFAULT '{}',
  "fotoCapa" TEXT,
  destaque BOOLEAN DEFAULT false,
  visualizacoes INTEGER DEFAULT 0,
  slug TEXT NOT NULL,
  "dataCriacao" TIMESTAMPTZ DEFAULT NOW(),
  "dataAtualizacao" TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_imoveis_status ON imoveis(status);
CREATE INDEX IF NOT EXISTS idx_imoveis_destaque ON imoveis(destaque);
CREATE INDEX IF NOT EXISTS idx_imoveis_slug ON imoveis(slug);
CREATE INDEX IF NOT EXISTS idx_imoveis_tipo ON imoveis(tipo);
CREATE INDEX IF NOT EXISTS idx_imoveis_dataCriacao ON imoveis("dataCriacao" DESC);

-- ============================================
-- 2. CRIAR TABELA: leads
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  imovelId UUID REFERENCES imoveis(id) ON DELETE SET NULL,
  tipoInteresse TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Novo',
  dataContato TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_dataContato ON leads(dataContato DESC);
CREATE INDEX IF NOT EXISTS idx_leads_imovelId ON leads(imovelId);

-- ============================================
-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE imoveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. POLÍTICAS RLS PARA: imoveis
-- ============================================

-- Política: Qualquer um pode ver imóveis publicados
CREATE POLICY "Public can view published imoveis" ON imoveis
FOR SELECT 
USING (status = 'Publicado');

-- Política: Usuários autenticados podem ver todos os imóveis
CREATE POLICY "Authenticated users can view all imoveis" ON imoveis
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Política: Usuários autenticados podem inserir imóveis
CREATE POLICY "Authenticated users can insert imoveis" ON imoveis
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Política: Usuários autenticados podem atualizar imóveis
CREATE POLICY "Authenticated users can update imoveis" ON imoveis
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Política: Usuários autenticados podem deletar imóveis
CREATE POLICY "Authenticated users can delete imoveis" ON imoveis
FOR DELETE 
USING (auth.role() = 'authenticated');

-- ============================================
-- 5. POLÍTICAS RLS PARA: leads
-- ============================================

-- Política: Qualquer um pode criar leads
CREATE POLICY "Anyone can create leads" ON leads
FOR INSERT 
WITH CHECK (true);

-- Política: Usuários autenticados podem ver todos os leads
CREATE POLICY "Authenticated users can view leads" ON leads
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Política: Usuários autenticados podem atualizar leads
CREATE POLICY "Authenticated users can update leads" ON leads
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Política: Usuários autenticados podem deletar leads
CREATE POLICY "Authenticated users can delete leads" ON leads
FOR DELETE 
USING (auth.role() = 'authenticated');

-- ============================================
-- 6. FUNÇÃO PARA ATUALIZAR dataAtualizacao AUTOMATICAMENTE
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.dataAtualizacao = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar dataAtualizacao automaticamente
-- A função detecta automaticamente se a coluna é "dataAtualizacao" ou "dataatualizacao"
CREATE TRIGGER update_imoveis_updated_at 
BEFORE UPDATE ON imoveis 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIM DO SCRIPT
-- ============================================
-- 
-- PRÓXIMOS PASSOS:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Vá em Storage e crie um bucket chamado "imoveis"
-- 3. Configure as políticas do Storage (veja SUPABASE_SETUP.md)
-- 4. Crie um usuário administrador em Authentication > Users
-- ============================================

