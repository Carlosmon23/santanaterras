import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Bed, Bath, Square } from 'lucide-react';
import { Imovel } from '../../types/imovel';
import { formatarPreco, formatarArea } from '../../utils/helpers';
import { Card, CardContent, CardHeader } from '../ui/Card';

interface ImovelCardProps {
  imovel: Imovel;
  className?: string;
}

export const ImovelCard: React.FC<ImovelCardProps> = ({ imovel, className }) => {
  return (
    <Card className={`group overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="relative">
        <img
          src={imovel.fotoCapa}
          alt={imovel.titulo}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {imovel.destaque && (
          <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
            Destaque
          </span>
        )}
        <span className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs font-semibold">
          {imovel.tipo}
        </span>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {imovel.titulo}
          </h3>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mt-1">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">
            {imovel.localizacao.bairro}, {imovel.localizacao.cidade}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-red-600">
            {formatarPreco(imovel.preco)}
          </span>
          <span className="text-sm text-gray-500">
            {formatarArea(imovel.areaTotal)}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{imovel.caracteristicas.quartos} quartos</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{imovel.caracteristicas.banheiros} banheiros</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{imovel.caracteristicas.suites} suítes</span>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <Link
            to={`/imovel/${imovel.slug}`}
            className="w-full bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Ver Detalhes
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};