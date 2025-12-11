import React from 'react';
import { Search, MapPin, Home } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../utils/helpers';

interface SearchFormProps {
  onSearch?: (filters: any) => void;
  className?: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, className }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar busca
    if (onSearch) {
      onSearch({});
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-lg">
        <div className="flex-1">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Cidade ou bairro"
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white">
            <option value="">Tipo de imóvel</option>
            <option value="sitio">Sítio</option>
            <option value="chacara">Chácara</option>
            <option value="casa">Casa</option>
            <option value="terreno">Terreno</option>
            <option value="fazenda">Fazenda</option>
          </select>
        </div>
        
        <div className="flex-1">
          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Faixa de preço"
              className="pl-10"
            />
          </div>
        </div>
        
        <Button type="submit" size="lg" className="md:w-auto">
          <Search className="w-5 h-5 mr-2" />
          Buscar
        </Button>
      </div>
    </form>
  );
};