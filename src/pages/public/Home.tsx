import React, { useEffect } from 'react';
import { useImovelStore } from '../../stores/imovelStore';
import { ImovelCard } from '../../components/imovel/ImovelCard';
import { Button } from '../../components/ui/Button';
import { Search, Filter, Grid, List, MapPin } from 'lucide-react';
import { useState } from 'react';

export const Home: React.FC = () => {
  const { 
    imoveisDestaque, 
    imoveisRecentes, 
    carregando,
    loadImoveis 
  } = useImovelStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  useEffect(() => {
    if (!imoveisDestaque.length && !imoveisRecentes.length) {
      loadImoveis();
    }
  }, [imoveisDestaque.length, imoveisRecentes.length, loadImoveis]);

  const isLoading =
    carregando && imoveisDestaque.length === 0 && imoveisRecentes.length === 0;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encontre seu paraíso no campo
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              A Santana Terras oferece as melhores propriedades rurais da região.
              Sítios, chácaras, fazendas e terrenos com a qualidade que você merece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Ver Imóveis
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-12 bg-white -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Encontre o imóvel perfeito para você
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    <option value="">Categoria</option>
                    <option value="Rural">Rural</option>
                    <option value="Urbano">Urbano</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cidade ou região"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <Button size="lg" className="w-full">
                  <Search className="w-5 h-5 mr-2" />
                  Buscar Imóveis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {isLoading && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center text-gray-600">
              Carregando imÇüveis...
            </div>
          </div>
        </section>
      )}
      
      {/* Featured Properties */}
      {imoveisDestaque.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Imóveis em Destaque</h2>
                <p className="text-gray-600">As melhores oportunidades selecionadas para você</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {imoveisDestaque.map((imovel) => (
                <ImovelCard key={imovel.id} imovel={imovel} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Recent Properties */}
      {imoveisRecentes.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recém-adicionados</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Confira os imóveis mais recentes adicionados ao nosso catálogo. 
                Novas oportunidades todos os dias!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imoveisRecentes.map((imovel) => (
                <ImovelCard key={imovel.id} imovel={imovel} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                Ver Todos os Imóveis
              </Button>
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Quer vender seu imóvel rural?
          </h2>
          <p className="text-xl mb-8 text-red-100 max-w-2xl mx-auto">
            A Santana Terras tem a experiência e o conhecimento necessários para 
            vender seu imóvel pelo melhor preço e no menor tempo possível.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline">
              Falar com Consultor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
