import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, ChevronDown, DollarSign } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { categoriasImovel } from '@/constants/imovelOptions';
import { CategoriaImovel } from '@/types/imovel';

interface FloatingSearchBarProps {
  className?: string;
}

export const FloatingSearchBar: React.FC<FloatingSearchBarProps> = ({ className }) => {
  const [formData, setFormData] = useState({
    location: '',
    categoria: '',
    priceRange: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    // Construir URL com parâmetros de busca
    const params = new URLSearchParams();
    if (formData.location) params.set('localizacao', formData.location);
    if (formData.categoria) params.set('categoria', formData.categoria);
    if (formData.priceRange) params.set('faixa', formData.priceRange);
    
    return `/busca?${params.toString()}`;
  };

  return (
    <div className={cn(
      'relative z-20 mx-auto max-w-6xl px-4',
      className
    )}>
      {/* Search Bar Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-5">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-400 rounded-3xl opacity-20 blur-lg"></div>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Location Search */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Localização
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cidade ou região"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all bg-white"
                />
              </div>
            </div>
            
            {/* Categoria */}
            <div className="relative">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Categoria
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select 
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                  >
                    <option value="">Todas as categorias</option>
                    {categoriasImovel.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            
            {/* Price Range */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Faixa de Preço
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select 
                  value={formData.priceRange}
                  onChange={(e) => handleInputChange('priceRange', e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                >
                  <option value="">Qualquer preço</option>
                  <option value="0-500000">Até R$ 500.000</option>
                  <option value="500000-1000000">R$ 500.000 - R$ 1.000.000</option>
                  <option value="1000000-5000000">R$ 1.000.000 - R$ 5.000.000</option>
                  <option value="5000000+">Acima de R$ 5.000.000</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
            
            {/* Search Button */}
            <div className="flex flex-col justify-end">
              <Link
                to={handleSearch()}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm"
              >
                <Search className="w-4 h-4" />
                <span>Buscar</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

