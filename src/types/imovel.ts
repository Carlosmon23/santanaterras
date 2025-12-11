export interface Imovel {
  id: string;
  titulo: string;
  tipo: TipoImovel;
  categoria?: CategoriaImovel; // Opcional para compatibilidade com dados antigos
  status: StatusImovel;
  preco: number | null; // null = "Sob Consulta"
  precoExibicao: string;
  localizacao: {
    cidade: string;
    bairro: string;
    estado: string;
  };
  areaTotal: number; // em m²
  areaUtil?: number; // em m² (opcional)
  caracteristicas: {
    quartos: number;
    suites: number;
    banheiros: number;
    vagasGaragem?: number;
    salaEstar?: boolean;
    salaJantar?: boolean;
    cozinha?: boolean;
    lavanderia?: boolean;
  };
  comodidades: Comodidade[];
  descricao: string;
  fotos: string[];
  fotoCapa: string;
  destaque: boolean;
  visualizacoes: number;
  dataCriacao: Date;
  dataAtualizacao: Date;
  slug: string;
}

// Categorias de imóveis
export type CategoriaImovel = 'Rural' | 'Urbano' | 'Comercial' | 'Industrial';

// Tipos de imóveis por categoria
export type TipoImovel = 
  // Rurais
  | 'Sítio'
  | 'Chácara' 
  | 'Fazenda'
  | 'Terreno Rural'
  // Urbanos
  | 'Casa'
  | 'Apartamento'
  | 'Sobrado'
  | 'Cobertura'
  | 'Terreno Urbano'
  // Comerciais
  | 'Sala Comercial'
  | 'Loja'
  | 'Ponto Comercial'
  | 'Galpão Comercial'
  | 'Escritório'
  | 'Terreno Comercial'
  // Industriais
  | 'Galpão Industrial'
  | 'Terreno Industrial'
  | 'Área Industrial';

// Mapeamento de tipos para categorias
export const categoriaPorTipo: Record<TipoImovel, CategoriaImovel> = {
  // Rurais
  'Sítio': 'Rural',
  'Chácara': 'Rural',
  'Fazenda': 'Rural',
  'Terreno Rural': 'Rural',
  // Urbanos
  'Casa': 'Urbano',
  'Apartamento': 'Urbano',
  'Sobrado': 'Urbano',
  'Cobertura': 'Urbano',
  'Terreno Urbano': 'Urbano',
  // Comerciais
  'Sala Comercial': 'Comercial',
  'Loja': 'Comercial',
  'Ponto Comercial': 'Comercial',
  'Galpão Comercial': 'Comercial',
  'Escritório': 'Comercial',
  'Terreno Comercial': 'Comercial',
  // Industriais
  'Galpão Industrial': 'Industrial',
  'Terreno Industrial': 'Industrial',
  'Área Industrial': 'Industrial',
};

export type StatusImovel = 'Rascunho' | 'Publicado' | 'Inativo';

export type Comodidade = 
  | 'Piscina'
  | 'Poço Artesiano'
  | 'Churrasqueira'
  | 'Espaço Gourmet'
  | 'Salão de Festas'
  | 'Campo de Futebol'
  | 'Pomar'
  | 'Nascente'
  | 'Curral'
  | 'Baias'
  | 'Casa de Caseiro'
  | 'Canil'
  | 'Salão de Ferramentas'
  | 'Galpão'
  | 'Tanques com Peixes'
  | 'Energia Solar'
  | 'Cerca Elétrica'
  | 'Portão Eletrônico'
  | 'Interfone'
  | 'Sistema de Segurança'
  | 'Área de Lazer'
  | 'Quadra Poliesportiva'
  | 'Aceita Permuta';

export interface FiltrosBusca {
  categoria?: CategoriaImovel[];
  tipo?: TipoImovel[];
  cidade?: string;
  faixaPrecoMin?: number;
  faixaPrecoMax?: number;
  quartosMin?: number;
  quartosMax?: number;
  suitesMin?: number;
  banheirosMin?: number;
  areaMin?: number;
  areaMax?: number;
  comodidades?: Comodidade[];
  destaque?: boolean;
}

export interface ContatoLead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  imovelId?: string;
  tipoInteresse: 'Visita' | 'Informações' | 'Proposta';
  dataContato: Date;
  status: 'Novo' | 'Respondido' | 'Convertido';
}