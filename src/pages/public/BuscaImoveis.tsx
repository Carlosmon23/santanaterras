import React, { useState, useEffect, useMemo } from 'react';
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
  Home
} from 'lucide-react';
import { useImovelStore } from '../../stores/imovelStore';
import { ImovelCard } from '../../components/imovel/ImovelCard';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { FiltrosBusca, Comodidade, Imovel, CategoriaImovel, TipoImovel } from '../../types/imovel';
import { formatarPreco, formatarArea } from '../../utils/helpers';
import { categoriasImovel, comodidadesDisponiveis, cidadesDisponiveis } from '@/constants/imovelOptions';

export const BuscaImoveis: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { imoveis, buscarImoveis } = useImovelStore();
  const [resultados, setResultados] = useState<Imovel[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recente' | 'preco_menor' | 'preco_maior' | 'area'>('recente');
  
  // Filtros
  const [filtros, setFiltros] = useState<FiltrosBusca>({
    tipo: [],
    cidade: '',
    faixaPrecoMin: undefined,
    faixaPrecoMax: undefined,
    quartosMin: undefined,
    banheirosMin: undefined,
    areaMin: undefined,
    areaMax: undefined,
    comodidades: []
  });

  const cidadesOpcoes = useMemo(() => {
    const set = new Set<string>();
    imoveis.forEach((imovel) => {
      if (imovel.localizacao?.cidade) {
        set.add(imovel.localizacao.cidade);
      }
    });
    return set.size ? Array.from(set).sort() : cidadesDisponiveis;
  }, [imoveis]);

  const comodidadesOpcoes = useMemo(() => {
    const set = new Set<Comodidade>();
    imoveis.forEach((imovel) => {
      imovel.comodidades.forEach((comodidade) => set.add(comodidade));
    });
    const lista = set.size ? Array.from(set) : comodidadesDisponiveis;
    return [...lista].sort();
  }, [imoveis]);
  
  // Carregar filtros da URL
  useEffect(() => {
    const urlFiltros: FiltrosBusca = {};
    
    if (searchParams.get('tipo')) {
      urlFiltros.tipo = searchParams.get('tipo')?.split(',') as TipoImovel[];
    }
    if (searchParams.get('cidade')) {
      urlFiltros.cidade = searchParams.get('cidade')!;
    }
    if (searchParams.get('preco_min')) {
      urlFiltros.faixaPrecoMin = parseInt(searchParams.get('preco_min')!);
    }
    if (searchParams.get('preco_max')) {
      urlFiltros.faixaPrecoMax = parseInt(searchParams.get('preco_max')!);
    }
    if (searchParams.get('quartos_min')) {
      urlFiltros.quartosMin = parseInt(searchParams.get('quartos_min')!);
    }
    if (searchParams.get('banheiros_min')) {
      urlFiltros.banheirosMin = parseInt(searchParams.get('banheiros_min')!);
    }
    if (searchParams.get('area_min')) {
      urlFiltros.areaMin = parseInt(searchParams.get('area_min')!);
    }
    if (searchParams.get('comodidades')) {
      urlFiltros.comodidades = searchParams.get('comodidades')?.split(',') as Comodidade[];
    }
    
    setFiltros(urlFiltros);
  }, [searchParams]);
  
  // Aplicar filtros e ordenação
  useEffect(() => {
    let resultadosFiltrados = buscarImoveis(filtros);
    
    // Ordenar resultados
    switch (sortBy) {
      case 'preco_menor':
        resultadosFiltrados.sort((a, b) => (a.preco || 0) - (b.preco || 0));
        break;
      case 'preco_maior':
        resultadosFiltrados.sort((a, b) => (b.preco || 0) - (a.preco || 0));
        break;
      case 'area':
        resultadosFiltrados.sort((a, b) => b.areaTotal - a.areaTotal);
        break;
      case 'recente':
      default:
        resultadosFiltrados.sort((a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime());
        break;
    }
    
    setResultados(resultadosFiltrados);
  }, [imoveis, filtros, sortBy, buscarImoveis]);
  
  const handleFiltroChange = (novosFiltros: Partial<FiltrosBusca>) => {
    const filtrosAtualizados = { ...filtros, ...novosFiltros };
    setFiltros(filtrosAtualizados);
    
    // Atualizar URL
    const params = new URLSearchParams();
    if (filtrosAtualizados.tipo?.length) {
      params.set('tipo', filtrosAtualizados.tipo.join(','));
    }
    if (filtrosAtualizados.cidade) {
      params.set('cidade', filtrosAtualizados.cidade);
    }
    if (filtrosAtualizados.faixaPrecoMin) {
      params.set('preco_min', filtrosAtualizados.faixaPrecoMin.toString());
    }
    if (filtrosAtualizados.faixaPrecoMax) {
      params.set('preco_max', filtrosAtualizados.faixaPrecoMax.toString());
    }
    if (filtrosAtualizados.quartosMin) {
      params.set('quartos_min', filtrosAtualizados.quartosMin.toString());
    }
    if (filtrosAtualizados.banheirosMin) {
      params.set('banheiros_min', filtrosAtualizados.banheirosMin.toString());
    }
    if (filtrosAtualizados.areaMin) {
      params.set('area_min', filtrosAtualizados.areaMin.toString());
    }
    if (filtrosAtualizados.comodidades?.length) {
      params.set('comodidades', filtrosAtualizados.comodidades.join(','));
    }
    
    setSearchParams(params);
  };
  
  const limparFiltros = () => {
    const filtrosLimposs: FiltrosBusca = {
      tipo: [],
      cidade: '',
      faixaPrecoMin: undefined,
      faixaPrecoMax: undefined,
      quartosMin: undefined,
      banheirosMin: undefined,
      areaMin: undefined,
      areaMax: undefined,
      comodidades: []
    };
    setFiltros(filtrosLimposs);
    setSearchParams(new URLSearchParams());
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Buscar Imóveis</h1>
              <p className="text-gray-600">
                {resultados.length} imóveis encontrados
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-red-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-red-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtros
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="recente">Mais Recentes</option>
                <option value="preco_menor">Preço: Menor para Maior</option>
                <option value="preco_maior">Preço: Maior para Menor</option>
                <option value="area">Área: Maior para Menor</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-4">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Filtros</CardTitle>
                <button
                  onClick={limparFiltros}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Limpar Todos
                </button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categoria */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Categoria</h3>
                  <div className="space-y-2">
                    {categoriasImovel.map(categoria => (
                      <label key={categoria} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filtros.categoria?.includes(categoria) || false}
                          onChange={(e) => {
                            const newCategorias = e.target.checked
                              ? [...(filtros.categoria || []), categoria]
                              : (filtros.categoria || []).filter(c => c !== categoria);
                            handleFiltroChange({ categoria: newCategorias });
                          }}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{categoria}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Location */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Localização</h3>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={filtros.cidade || ''}
                      onChange={(e) => handleFiltroChange({ cidade: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Todas as cidades</option>
                      {cidadesOpcoes.map(cidade => (
                        <option key={cidade} value={cidade}>{cidade}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Price Range */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Faixa de Preço</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        placeholder="Mínimo"
                        value={filtros.faixaPrecoMin || ''}
                        onChange={(e) => handleFiltroChange({ faixaPrecoMin: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="Máximo"
                      value={filtros.faixaPrecoMax || ''}
                      onChange={(e) => handleFiltroChange({ faixaPrecoMax: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                
                {/* Bedrooms */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Quartos</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        onClick={() => handleFiltroChange({ quartosMin: num === 0 ? undefined : num })}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          filtros.quartosMin === num || (num === 0 && !filtros.quartosMin)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {num === 0 ? 'Qualquer' : `${num}+`}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Bathrooms */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Banheiros</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        onClick={() => handleFiltroChange({ banheirosMin: num === 0 ? undefined : num })}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          filtros.banheirosMin === num || (num === 0 && !filtros.banheirosMin)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {num === 0 ? 'Qualquer' : `${num}+`}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Area Range */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Área (m²)</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Mínima"
                      value={filtros.areaMin || ''}
                      onChange={(e) => handleFiltroChange({ areaMin: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <input
                      type="number"
                      placeholder="Máxima"
                      value={filtros.areaMax || ''}
                      onChange={(e) => handleFiltroChange({ areaMax: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                
                {/* Amenities */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Comodidades</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {comodidadesOpcoes.slice(0, 10).map(comodidade => (
                      <label key={comodidade} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filtros.comodidades?.includes(comodidade) || false}
                          onChange={(e) => {
                            const newComodidades = e.target.checked
                              ? [...(filtros.comodidades || []), comodidade]
                              : (filtros.comodidades || []).filter(c => c !== comodidade);
                            handleFiltroChange({ comodidades: newComodidades });
                          }}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{comodidade}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Results */}
          <div className="flex-1">
            {resultados.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum imóvel encontrado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tente ajustar os filtros ou remova algumas restrições.
                  </p>
                  <Button onClick={limparFiltros}>
                    Limpar Filtros
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {resultados.map((imovel) => (
                  <ImovelCard key={imovel.id} imovel={imovel} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
