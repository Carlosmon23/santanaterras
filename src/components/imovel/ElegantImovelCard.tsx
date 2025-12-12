import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, Eye } from 'lucide-react';
import { Imovel } from '@/types/imovel';
import { formatarPreco, formatarArea, gerarSlug } from '@/utils/helpers';
import { cn } from '@/utils/helpers';

interface ElegantImovelCardProps {
  imovel: Imovel;
  className?: string;
  showStats?: boolean;
}

export const ElegantImovelCard: React.FC<ElegantImovelCardProps> = ({ 
  imovel, 
  className,
  showStats = true 
}) => {
  const tipoColors = {
    'Sítio': 'bg-green-100 text-green-800',
    'Chácara': 'bg-blue-100 text-blue-800',
    'Fazenda': 'bg-amber-100 text-amber-800',
    'Terreno': 'bg-purple-100 text-purple-800',
    'Casa': 'bg-red-100 text-red-800',
    'Sobrado': 'bg-gray-100 text-gray-800',
    'Apartamento': 'bg-indigo-100 text-indigo-800',
    'Cobertura': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className={cn('group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden', className)}>
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imovel.fotoCapa}
          alt={imovel.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{imovel.visualizacoes} visualizações</span>
              </div>
              <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Property Type Badge */}
        <div className="absolute top-4 left-4">
          <span className={cn(
            'px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm',
            tipoColors[imovel.tipo] || 'bg-gray-100 text-gray-800'
          )}>
            {imovel.tipo}
          </span>
        </div>
        
        {/* Featured Badge */}
        {imovel.destaque && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
              Destaque
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
            {imovel.titulo}
          </h3>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{imovel.localizacao.cidade}, {imovel.localizacao.estado}</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {imovel.descricao}
        </p>
        
        {/* Features */}
        {showStats && (
          <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-100">
            {imovel.caracteristicas.quartos > 0 && (
              <div className="flex items-center text-gray-500 text-sm">
                <Bed className="w-4 h-4 mr-1" />
                <span>{imovel.caracteristicas.quartos} quartos</span>
              </div>
            )}
            {imovel.caracteristicas.banheiros > 0 && (
              <div className="flex items-center text-gray-500 text-sm">
                <Bath className="w-4 h-4 mr-1" />
                <span>{imovel.caracteristicas.banheiros} banheiros</span>
              </div>
            )}
            <div className="flex items-center text-gray-500 text-sm">
              <Square className="w-4 h-4 mr-1" />
              <span>{formatarArea(imovel.areaTotal)}</span>
            </div>
          </div>
        )}
        
        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {(imovel.precoExibicao && imovel.precoExibicao !== 'NaN' && imovel.precoExibicao !== 'R$ NaN')
                ? imovel.precoExibicao
                : formatarPreco(imovel.preco ?? null)}
            </div>
            {imovel.preco && (
              <div className="text-xs text-gray-500 mt-1">
                R$ {(imovel.preco / 1000).toFixed(0)} mil
              </div>
            )}
          </div>
          
          <Link
            to={`/imovel/${imovel.slug}`}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
};