import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Star,
  EyeOff,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useImovelStore } from '../../stores/imovelStore';
import { Imovel, StatusImovel } from '../../types/imovel';
import { formatarPreco, formatarData } from '../../utils/helpers';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

export const AdminImoveis: React.FC = () => {
  const { imoveis, setImoveis, loadImoveis, deleteImovel, saveImovel } = useImovelStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusImovel | 'all'>('all');
  const [tipoFilter, setTipoFilter] = useState<string>('all');
  const [filteredImoveis, setFilteredImoveis] = useState<Imovel[]>(imoveis);
  
  useEffect(() => {
    loadImoveis();
  }, [loadImoveis]);

  useEffect(() => {
    let filtered = imoveis;
    
    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(imovel =>
        imovel.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imovel.localizacao.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imovel.localizacao.bairro.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(imovel => imovel.status === statusFilter);
    }
    
    // Filtrar por tipo
    if (tipoFilter !== 'all') {
      filtered = filtered.filter(imovel => imovel.tipo === tipoFilter);
    }
    
    setFilteredImoveis(filtered);
  }, [imoveis, searchTerm, statusFilter, tipoFilter]);
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel?')) {
      await deleteImovel(id);
    }
  };
  
  const toggleStatus = async (id: string) => {
    const item = imoveis.find(i => i.id === id);
    if (!item) return;
    const newStatus: StatusImovel = 
      item.status === 'Publicado' ? 'Inativo' : 
      item.status === 'Inativo' ? 'Rascunho' : 'Publicado';
    await saveImovel({ ...item, status: newStatus });
  };
  
  const toggleDestaque = async (id: string) => {
    const item = imoveis.find(i => i.id === id);
    if (!item) return;
    await saveImovel({ ...item, destaque: !item.destaque });
  };
  
  const getStatusColor = (status: StatusImovel) => {
    switch (status) {
      case 'Publicado': return 'bg-green-100 text-green-800';
      case 'Rascunho': return 'bg-yellow-100 text-yellow-800';
      case 'Inativo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const tiposDisponiveis = [...new Set(imoveis.map(imovel => imovel.tipo))];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Imóveis</h1>
          <p className="text-gray-600 mt-1">
            Total de {filteredImoveis.length} imóveis
          </p>
        </div>
        <Link to="/admin/imoveis/novo">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Imóvel
          </Button>
        </Link>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por título, cidade ou bairro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusImovel | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Todos os status</option>
              <option value="Publicado">Publicado</option>
              <option value="Rascunho">Rascunho</option>
              <option value="Inativo">Inativo</option>
            </select>
            
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Todos os tipos</option>
              {tiposDisponiveis.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>
      
      {/* Properties List */}
      <div className="space-y-4">
        {filteredImoveis.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum imóvel encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar os filtros ou adicione um novo imóvel.
              </p>
              <Link to="/admin/imoveis/novo">
                <Button>Adicionar Novo Imóvel</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredImoveis.map((imovel) => (
            <Card key={imovel.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={imovel.fotoCapa}
                      alt={imovel.titulo}
                      className="w-full lg:w-32 h-24 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {imovel.titulo}
                          </h3>
                          {imovel.destaque && (
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{imovel.localizacao.cidade}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            <span>{imovel.tipo}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatarData(imovel.dataCriacao)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-medium text-gray-900">
                            {formatarPreco(imovel.preco)}
                          </span>
                          <span className="text-gray-600">
                            {imovel.areaTotal.toLocaleString('pt-BR')} m²
                          </span>
                          <span className="text-gray-600">
                            {imovel.caracteristicas.quartos} quartos
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-end gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(imovel.status)}`}>
                          {imovel.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {imovel.visualizacoes} visualizações
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <Link
                      to={`/imovel/${imovel.slug}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Visualizar"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    
                    <button
                      onClick={() => toggleDestaque(imovel.id)}
                      className={`p-2 transition-colors ${
                        imovel.destaque 
                          ? 'text-yellow-500 hover:text-yellow-600' 
                          : 'text-gray-400 hover:text-yellow-500'
                      }`}
                      title={imovel.destaque ? 'Remover destaque' : 'Marcar destaque'}
                    >
                      <Star className={`w-5 h-5 ${imovel.destaque ? 'fill-current' : ''}`} />
                    </button>
                    
                    <button
                      onClick={() => toggleStatus(imovel.id)}
                      className={`p-2 transition-colors ${
                        imovel.status === 'Publicado' 
                          ? 'text-green-600 hover:text-green-700' 
                          : 'text-gray-400 hover:text-green-600'
                      }`}
                      title={imovel.status === 'Publicado' ? 'Tornar inativo' : 'Publicar'}
                    >
                      {imovel.status === 'Publicado' ? 
                        <EyeOff className="w-5 h-5" /> : 
                        <Eye className="w-5 h-5" />
                      }
                    </button>
                    
                    <Link
                      to={`/admin/imoveis/editar/${imovel.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(imovel.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
