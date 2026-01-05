import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Home as HomeIcon, ChevronDown, DollarSign } from 'lucide-react';
import { cn } from '@/utils/helpers';
import heroBg from '../../assets/hero-bg-new.jpg';

interface HeroSectionProps {
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  return (
    <section className={cn('relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden', className)}>
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          {/* Headline */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif italic text-white mb-4 leading-tight">
              Compre. Venda.
              <span className="block text-red-400">Desfrute.</span>
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8">
              Imóveis Rurais com Excelência
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl leading-relaxed">
              Descubra sítios, chácaras e fazendas exclusivas no coração do Brasil.
              Tradição e confiança em cada transação.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location Search */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Localização"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Property Type */}
              <div className="relative">
                <HomeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all appearance-none bg-white">
                  <option value="">Tipo de Imóvel</option>
                  <option value="sitio">Sítio</option>
                  <option value="chacara">Chácara</option>
                  <option value="fazenda">Fazenda</option>
                  <option value="terreno">Terreno</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Price Range */}
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all appearance-none bg-white">
                  <option value="">Faixa de Preço</option>
                  <option value="0-500000">Até R$ 500.000</option>
                  <option value="500000-1000000">R$ 500.000 - R$ 1.000.000</option>
                  <option value="1000000-5000000">R$ 1.000.000 - R$ 5.000.000</option>
                  <option value="5000000+">Acima de R$ 5.000.000</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Search Button */}
              <Link
                to="/busca"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Buscar</span>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">150+</div>
              <div className="text-gray-300 text-sm">Imóveis Vendidos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">15+</div>
              <div className="text-gray-300 text-sm">Anos de Experiência</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-gray-300 text-sm">Clientes Satisfeitos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};