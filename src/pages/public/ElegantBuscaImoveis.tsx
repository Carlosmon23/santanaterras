import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  Grid,
  List,
  ChevronDown,
  Home,
  ArrowRight,
  Star
} from 'lucide-react';
import { useImovelStore } from '@/stores/imovelStore';
import { ElegantImovelCard } from '@/components/imovel/ElegantImovelCard';
import { ElegantHeader } from '@/components/layout/ElegantHeader';
import { Imovel, FiltrosBusca, CategoriaImovel } from '@/types/imovel';
import { formatarPreco, formatarArea } from '@/utils/helpers';
import { cn } from '@/utils/helpers';
import { categoriasImovel } from '@/constants/imovelOptions';
import { buscaHeroImage } from '@/config/heroImages';
import newHeroBg from '../../assets/hero-bg-new.jpg';

export const ElegantBuscaImoveis: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { imoveis, buscarImoveis } = useImovelStore();
  const [resultados, setResultados] = useState<Imovel[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recente' | 'preco_menor' | 'preco_maior' | 'area'>('recente');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaImovel | 'Todos'>('Todos');

  // Filter states - apenas categoria, sem tipos específicos
  const [filtros, setFiltros] = useState<FiltrosBusca>({
    cidade: searchParams.get('localizacao') || '',
    categoria: searchParams.get('categoria') ? [searchParams.get('categoria') as CategoriaImovel] : undefined,
    faixaPrecoMin: searchParams.get('faixa')?.split('-')[0] ? parseInt(searchParams.get('faixa')?.split('-')[0] || '0') : undefined,
    faixaPrecoMax: searchParams.get('faixa')?.split('-')[1] ? parseInt(searchParams.get('faixa')?.split('-')[1] || '0') : undefined,
  });

  useEffect(() => {
    // Apply initial search params
    const resultadosFiltrados = buscarImoveis(filtros);
    setResultados(resultadosFiltrados);
  }, [imoveis, filtros, buscarImoveis]);

  useEffect(() => {
    // Update search params when filters change
    const params = new URLSearchParams();
    if (filtros.cidade) params.set('localizacao', filtros.cidade);
    if (filtros.categoria && filtros.categoria.length > 0) params.set('categoria', filtros.categoria[0]);
    if (filtros.faixaPrecoMin) params.set('precoMin', filtros.faixaPrecoMin.toString());
    if (filtros.faixaPrecoMax) params.set('precoMax', filtros.faixaPrecoMax.toString());
    setSearchParams(params);
  }, [filtros, setSearchParams]);

  const handleSortChange = (sort: typeof sortBy) => {
    setSortBy(sort);
    let sorted = [...resultados];

    switch (sort) {
      case 'preco_menor':
        sorted.sort((a, b) => (a.preco || 0) - (b.preco || 0));
        break;
      case 'preco_maior':
        sorted.sort((a, b) => (b.preco || 0) - (a.preco || 0));
        break;
      case 'area':
        sorted.sort((a, b) => b.areaTotal - a.areaTotal);
        break;
      case 'recente':
      default:
        sorted.sort((a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime());
        break;
    }

    setResultados(sorted);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ElegantHeader />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${newHeroBg}')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif italic text-white mb-6">
            Encontre sua
            <span className="block text-red-400">Propriedade dos Sonhos</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            {resultados.length} propriedades rurais e urbanas disponíveis para você
          </p>
        </div>
      </section>

      {/* Category Filter - Apenas as 4 categorias principais */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Filtro por Categoria */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center lg:text-left">Filtrar por Categoria</h3>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <button
                  onClick={() => {
                    setCategoriaSelecionada('Todos');
                    setFiltros(prev => ({ ...prev, categoria: undefined }));
                  }}
                  className={cn(
                    'px-6 py-3 rounded-full text-base font-medium transition-all duration-200',
                    'hover:scale-105 active:scale-95',
                    categoriaSelecionada === 'Todos'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-red-300 hover:text-red-600'
                  )}
                >
                  Todos
                </button>
                {categoriasImovel.map(categoria => (
                  <button
                    key={categoria}
                    onClick={() => {
                      setCategoriaSelecionada(categoria);
                      setFiltros(prev => ({
                        ...prev,
                        categoria: [categoria]
                      }));
                    }}
                    className={cn(
                      'px-6 py-3 rounded-full text-base font-medium transition-all duration-200',
                      'hover:scale-105 active:scale-95',
                      categoriaSelecionada === categoria
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-red-300 hover:text-red-600'
                    )}
                  >
                    {categoria}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                >
                  <option value="recente">Mais Recentes</option>
                  <option value="preco_menor">Menor Preço</option>
                  <option value="preco_maior">Maior Preço</option>
                  <option value="area">Maior Área</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'grid' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'list' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {resultados.length === 0 ? (
            <div className="text-center py-16">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum imóvel encontrado</h3>
              <p className="text-gray-600 mb-6">Tente ajustar seus filtros de busca</p>
              <Link
                to="/"
                className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <span>Voltar para Home</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className={cn(
              'grid gap-8',
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 lg:grid-cols-2'
            )}>
              {resultados.map((imovel) => (
                <ElegantImovelCard
                  key={imovel.id}
                  imovel={imovel}
                  showStats={true}
                  className={viewMode === 'list' ? 'flex' : ''}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
