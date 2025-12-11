import React, { useEffect, useState } from 'react';
import { useImovelStore } from '@/stores/imovelStore';
import { ElegantImovelCard } from '@/components/imovel/ElegantImovelCard';
import { ElegantHeader } from '@/components/layout/ElegantHeader';
import { ElegantStats } from '@/components/ui/ElegantStats';
import { FloatingSearchBar } from '@/components/layout/FloatingSearchBar';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Award, Shield, TrendingUp, Users, Home } from 'lucide-react';
import { Imovel, CategoriaImovel } from '@/types/imovel';
import { categoriasImovel } from '@/constants/imovelOptions';
import { cn } from '@/utils/helpers';
import { heroImages } from '@/config/heroImages';

export const ElegantHome: React.FC = () => {
  const { 
    imoveis, 
    imoveisDestaque, 
    imoveisRecentes, 
    loadImoveis
  } = useImovelStore();
  
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [filteredImoveis, setFilteredImoveis] = useState<Imovel[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(Array(heroImages.length).fill(false));
  
  useEffect(() => {
    if (imoveis.length === 0) {
      loadImoveis();
    }
  }, [imoveis.length, loadImoveis]);

  useEffect(() => {
    heroImages.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setLoaded(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      };
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex(prev => {
        const next = (prev + 1) % heroImages.length;
        return loaded[next] ? next : prev;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [loaded]);
  
  useEffect(() => {
    if (selectedCategory === 'Todos') {
      setFilteredImoveis(imoveisRecentes);
    } else {
      // Filtrar por categoria
      setFilteredImoveis(imoveisRecentes.filter(imovel => {
        const categoriaImovel = imovel.categoria || (imovel.tipo === 'Sítio' || imovel.tipo === 'Chácara' || imovel.tipo === 'Fazenda' || imovel.tipo === 'Terreno' ? 'Rural' : 'Urbano');
        return categoriaImovel === selectedCategory;
      }));
    }
  }, [selectedCategory, imoveisRecentes]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Elegant Header */}
      <ElegantHeader />
      
      {/* Hero Section - Full Screen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: `url('${src}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
            </div>
          ))}
        </div>
        
        {/* Hero Content - Com mais espaço do topo */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-32">
          <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif italic text-white mb-4 leading-tight">
                Imóveis Rurais & 
                <span className="block text-red-400">Urbanos</span>
              </h1>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                O lugar certo para campo e cidade
              </h2>
              <p className="text-base sm:text-lg text-gray-200 max-w-2xl leading-relaxed">
                Especialistas em imóveis rurais, com ampla carteira urbana. 
                Encontre sítios, chácaras, fazendas, casas e apartamentos em um só lugar.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Floating Search Bar */}
      <div className="relative -mt-20 z-20">
        <FloatingSearchBar />
      </div>
      
      {/* Featured Properties Section */}
      <section className="pt-16 pb-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-semibold text-gray-900 mb-4">
              Descubra Propriedades
              <span className="block text-red-600 italic mt-2">Exclusivas</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Selecionamos as melhores oportunidades rurais e urbanas para você encontrar 
              exatamente o que procura.
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory('Todos')}
                className={cn(
                  'px-6 py-3 rounded-full text-base font-medium transition-all duration-200',
                  'hover:scale-105 active:scale-95',
                  selectedCategory === 'Todos'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-red-300 hover:text-red-600'
                )}
              >
                Todos
              </button>
              {categoriasImovel.map(categoria => (
                <button
                  key={categoria}
                  onClick={() => setSelectedCategory(categoria)}
                  className={cn(
                    'px-6 py-3 rounded-full text-base font-medium transition-all duration-200',
                    'hover:scale-105 active:scale-95',
                    selectedCategory === categoria
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-red-300 hover:text-red-600'
                  )}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
          
          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImoveis.slice(0, 6).map((imovel) => (
              <ElegantImovelCard key={imovel.id} imovel={imovel} />
            ))}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/busca"
              className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              <span>Ver Todos os Imóveis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-semibold text-gray-900 mb-4">
              Nossos Números
              <span className="block text-red-600 italic mt-2">Falam por Si</span>
            </h2>
          </div>
          
          <ElegantStats
            stats={[
              { 
                number: '150+', 
                label: 'Imóveis Vendidos',
                icon: <Home className="w-6 h-6" />
              },
              { 
                number: '15+', 
                label: 'Anos de Experiência',
                icon: <Award className="w-6 h-6" />
              },
              { 
                number: '98%', 
                label: 'Clientes Satisfeitos',
                icon: <Star className="w-6 h-6" />
              },
              { 
                number: '500+', 
                label: 'Propriedades Avaliadas',
                icon: <TrendingUp className="w-6 h-6" />
              }
            ]}
          />
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-semibold text-gray-900 mb-4">
              Por Que Escolher a
              <span className="block text-red-600 italic mt-2">Santana Terras?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tradição, confiança e excelência em imóveis rurais e urbanos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Excelência</h3>
              <p className="text-gray-600">
                Mais de 15 anos de experiência no mercado de imóveis rurais, 
                com foco em qualidade e satisfação do cliente.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Confiança</h3>
              <p className="text-gray-600">
                Transparência em todas as negociações, com documentação 
                completa e processos seguros.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Atendimento</h3>
              <p className="text-gray-600">
                Equipe especializada e dedicada, pronta para ajudar 
                você encontrar o imóvel perfeito.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-semibold mb-6">
            Pronto para Encontrar sua Propriedade dos Sonhos?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Entre em contato com nossa equipe especializada e 
            descubra como podemos ajudar você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contato"
              className="inline-flex items-center justify-center bg-white text-red-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
