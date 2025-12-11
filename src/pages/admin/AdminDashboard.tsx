import React from 'react';
import { 
  Building2, 
  Eye, 
  Users, 
  TrendingUp,
  Home,
  DollarSign,
  MapPin,
  Calendar
} from 'lucide-react';
import { useImovelStore } from '../../stores/imovelStore';
import { formatarPreco } from '../../utils/helpers';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export const AdminDashboard: React.FC = () => {
  const { imoveis } = useImovelStore();
  
  // Calcular estatísticas
  const totalImoveis = imoveis.length;
  const imoveisAtivos = imoveis.filter(i => i.status === 'Publicado').length;
  const imoveisDestaque = imoveis.filter(i => i.destaque).length;
  const imoveisRascunho = imoveis.filter(i => i.status === 'Rascunho').length;
  
  // Calcular valor total dos imóveis
  const valorTotal = imoveis
    .filter(i => i.preco !== null)
    .reduce((sum, imovel) => sum + (imovel.preco || 0), 0);
  
  // Imóveis mais visualizados
  const imoveisMaisVisualizados = [...imoveis]
    .sort((a, b) => b.visualizacoes - a.visualizacoes)
    .slice(0, 5);
  
  const statCards = [
    {
      title: 'Total de Imóveis',
      value: totalImoveis,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Imóveis Ativos',
      value: imoveisAtivos,
      icon: Home,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Em Destaque',
      value: imoveisDestaque,
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Rascunhos',
      value: imoveisRascunho,
      icon: Calendar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Atualizado em: {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Valor Total e Média */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Valor Total dos Imóveis
            </CardTitle>
            <DollarSign className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatarPreco(valorTotal)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Média: {formatarPreco(valorTotal / Math.max(imoveisAtivos, 1))}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Publicação
            </CardTitle>
            <Eye className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalImoveis > 0 ? Math.round((imoveisAtivos / totalImoveis) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {imoveisAtivos} de {totalImoveis} imóveis publicados
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Imóveis Mais Visualizados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-600" />
            Imóveis Mais Visualizados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {imoveisMaisVisualizados.length > 0 ? (
              imoveisMaisVisualizados.map((imovel, index) => (
                <div key={imovel.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{imovel.titulo}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {imovel.localizacao.cidade}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {imovel.visualizacoes} visualizações
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatarPreco(imovel.preco)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhum imóvel cadastrado ainda.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-base">Adicionar Novo Imóvel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Cadastre um novo imóvel no sistema
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-red-600 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-base">Verificar Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Gerencie os contatos recebidos
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-600">0</span>
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-base">Configurações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Ajuste as configurações do sistema
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Última atualização</span>
              <span className="text-sm font-medium">Hoje</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};