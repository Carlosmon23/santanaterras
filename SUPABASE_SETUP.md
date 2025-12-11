# Configuração do Supabase

Este projeto está configurado para usar o Supabase como backend. Siga os passos abaixo para configurar corretamente.

## 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://alnyrhzrhsepweapunwx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbnlyaHpyaHNlcHdlYXB1bnd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NzI0NjgsImV4cCI6MjA4MTA0ODQ2OH0.MpjUMmqLqVKWZZ9ZVKJoFo72jyvGKMkBU04jXn94mbw
```

## 2. Estrutura do Banco de Dados

### Tabela: `imoveis`

```sql
CREATE TABLE imoveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Rascunho',
  preco NUMERIC,
  precoExibicao TEXT,
  localizacao JSONB NOT NULL DEFAULT '{"cidade": "", "bairro": "", "estado": ""}',
  areaTotal NUMERIC NOT NULL,
  areaUtil NUMERIC,
  caracteristicas JSONB NOT NULL DEFAULT '{"quartos": 0, "suites": 0, "banheiros": 0}',
  comodidades TEXT[] DEFAULT '{}',
  descricao TEXT NOT NULL,
  fotos TEXT[] DEFAULT '{}',
  fotoCapa TEXT,
  destaque BOOLEAN DEFAULT false,
  visualizacoes INTEGER DEFAULT 0,
  slug TEXT NOT NULL,
  dataCriacao TIMESTAMPTZ DEFAULT NOW(),
  dataAtualizacao TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_imoveis_status ON imoveis(status);
CREATE INDEX idx_imoveis_destaque ON imoveis(destaque);
CREATE INDEX idx_imoveis_slug ON imoveis(slug);
CREATE INDEX idx_imoveis_tipo ON imoveis(tipo);
```

### Tabela: `leads`

```sql
CREATE TABLE leads (
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
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_dataContato ON leads(dataContato);
CREATE INDEX idx_leads_imovelId ON leads(imovelId);
```

## 3. Storage (Bucket para Imagens)

Crie um bucket chamado `imoveis` no Storage do Supabase:

1. Acesse o painel do Supabase
2. Vá em Storage
3. Crie um novo bucket chamado `imoveis`
4. Configure as políticas de acesso:

```sql
-- Política para permitir leitura pública
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'imoveis');

-- Política para permitir upload apenas para usuários autenticados
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'imoveis' AND
  auth.role() = 'authenticated'
);

-- Política para permitir atualização apenas para usuários autenticados
CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'imoveis' AND
  auth.role() = 'authenticated'
);

-- Política para permitir exclusão apenas para usuários autenticados
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'imoveis' AND
  auth.role() = 'authenticated'
);
```

## 4. Autenticação

### Criar usuário administrador

1. Acesse o painel do Supabase
2. Vá em Authentication > Users
3. Clique em "Add user" > "Create new user"
4. Preencha:
   - Email: seu-email@exemplo.com
   - Password: sua-senha-segura
   - Auto Confirm User: Sim (para não precisar confirmar email)

### Row Level Security (RLS)

Configure as políticas RLS nas tabelas:

```sql
-- Habilitar RLS
ALTER TABLE imoveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Políticas para imoveis
-- Leitura pública para imóveis publicados
CREATE POLICY "Public can view published imoveis" ON imoveis
FOR SELECT USING (status = 'Publicado');

-- Usuários autenticados podem fazer tudo
CREATE POLICY "Authenticated users can manage imoveis" ON imoveis
FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para leads
-- Qualquer um pode criar leads
CREATE POLICY "Anyone can create leads" ON leads
FOR INSERT WITH CHECK (true);

-- Apenas usuários autenticados podem ver e gerenciar leads
CREATE POLICY "Authenticated users can manage leads" ON leads
FOR ALL USING (auth.role() = 'authenticated');
```

## 5. Verificação

Após configurar tudo:

1. Reinicie o servidor de desenvolvimento
2. Acesse `/admin/login`
3. Faça login com as credenciais criadas
4. Teste criar, editar e deletar um imóvel
5. Teste o upload de imagens

## Notas Importantes

- As credenciais do Supabase estão hardcoded no código como fallback, mas é recomendado usar variáveis de ambiente
- Certifique-se de que o bucket `imoveis` existe antes de tentar fazer upload
- As políticas RLS são importantes para segurança - ajuste conforme necessário
- O slug dos imóveis é gerado automaticamente a partir do título

