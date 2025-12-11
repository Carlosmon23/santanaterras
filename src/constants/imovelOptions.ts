import { Comodidade, TipoImovel, CategoriaImovel, categoriaPorTipo } from '@/types/imovel';

// Categorias disponíveis
export const categoriasImovel: CategoriaImovel[] = [
  'Rural',
  'Urbano',
  'Comercial',
  'Industrial',
];

// Tipos por categoria
export const tiposPorCategoria: Record<CategoriaImovel, TipoImovel[]> = {
  Rural: [
    'Sítio',
    'Chácara',
    'Fazenda',
    'Terreno Rural',
  ],
  Urbano: [
    'Casa',
    'Apartamento',
    'Sobrado',
    'Cobertura',
    'Terreno Urbano',
  ],
  Comercial: [
    'Sala Comercial',
    'Loja',
    'Ponto Comercial',
    'Galpão Comercial',
    'Escritório',
    'Terreno Comercial',
  ],
  Industrial: [
    'Galpão Industrial',
    'Terreno Industrial',
    'Área Industrial',
  ],
};

// Todos os tipos (para compatibilidade)
export const tiposImovel: TipoImovel[] = [
  ...tiposPorCategoria.Rural,
  ...tiposPorCategoria.Urbano,
  ...tiposPorCategoria.Comercial,
  ...tiposPorCategoria.Industrial,
];

// Função auxiliar para obter categoria de um tipo
export const obterCategoria = (tipo: TipoImovel): CategoriaImovel => {
  return categoriaPorTipo[tipo] || 'Urbano';
};

export const comodidadesDisponiveis: Comodidade[] = [
  'Piscina',
  'Poço Artesiano',
  'Churrasqueira',
  'Espaço Gourmet',
  'Salão de Festas',
  'Campo de Futebol',
  'Pomar',
  'Nascente',
  'Curral',
  'Baias',
  'Casa de Caseiro',
  'Canil',
  'Salão de Ferramentas',
  'Galpão',
  'Tanques com Peixes',
  'Energia Solar',
  'Cerca Elétrica',
  'Portão Eletrônico',
  'Interfone',
  'Sistema de Segurança',
  'Área de Lazer',
  'Quadra Poliesportiva',
  'Aceita Permuta',
];

export const cidadesDisponiveis = [
  'São Pedro',
  'Campinas',
  'Brotas',
  'Piracicaba',
  'Rio Claro',
  'Águas de São Pedro',
];
