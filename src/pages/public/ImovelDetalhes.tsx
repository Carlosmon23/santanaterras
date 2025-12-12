import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Phone, 
  Mail, 
  Calendar,
  Star,
  Heart,
  Share2,
  Car,
  Home as HomeIcon
} from 'lucide-react';
import { useImovelStore } from '../../stores/imovelStore';
import { useLeadStore } from '@/stores/leadStore';
import { Imovel } from '../../types/imovel';
import { formatarPreco, formatarArea, formatarData } from '../../utils/helpers';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { ElegantHeader } from '@/components/layout/ElegantHeader';

export const ImovelDetalhes: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { imoveis, setImovelSelecionado, imovelSelecionado, saveImovel } = useImovelStore();
  const { addLead } = useLeadStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  });
  
  // Usar useRef para rastrear se já incrementou as visualizações para este slug
  const hasIncrementedViews = useRef<string | null>(null);
  
  // Carregar o imóvel quando o slug mudar
  useEffect(() => {
    if (!slug) return;
    
    // Reset do ref quando o slug mudar
    if (hasIncrementedViews.current !== slug) {
      hasIncrementedViews.current = null;
    }
    
    const imovel = imoveis.find(i => i.slug === slug);
    if (imovel) {
      setImovelSelecionado(imovel);
      
      // Incrementar visualizações apenas uma vez por slug (quando a página é carregada pela primeira vez)
      if (hasIncrementedViews.current === null) {
        hasIncrementedViews.current = slug;
        // Usar o valor atual do imóvel antes de incrementar
        const currentViews = imovel.visualizacoes || 0;
        saveImovel({ ...imovel, visualizacoes: currentViews + 1 });
      }
    }
  }, [slug]); // Apenas slug como dependência - buscar imóvel quando slug mudar
  
  // Buscar imóvel quando a lista de imóveis for carregada (se ainda não foi encontrado)
  useEffect(() => {
    if (!slug || imovelSelecionado || imoveis.length === 0) return;
    
    const imovel = imoveis.find(i => i.slug === slug);
    if (imovel) {
      setImovelSelecionado(imovel);
      
      // Incrementar visualizações apenas uma vez
      if (hasIncrementedViews.current === null) {
        hasIncrementedViews.current = slug;
        const currentViews = imovel.visualizacoes || 0;
        saveImovel({ ...imovel, visualizacoes: currentViews + 1 });
      }
    }
  }, [imoveis.length, slug, imovelSelecionado]); // Apenas quando a lista for carregada
  
  if (!imovelSelecionado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <HomeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Imóvel não encontrado</h2>
          <p className="text-gray-600 mb-4">O imóvel que você está procurando não existe ou foi removido.</p>
          <Button onClick={() => navigate('/busca')}>
            Voltar para Busca
          </Button>
        </div>
      </div>
    );
  }
  
  const imovel = imovelSelecionado;
  
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addLead({
      nome: contactForm.nome,
      email: contactForm.email,
      telefone: contactForm.telefone,
      mensagem: contactForm.mensagem || `Interesse no imóvel ${imovel.titulo}`,
      imovelId: imovel.id,
      tipoInteresse: 'Visita'
    });
    alert('Obrigado pelo interesse! Entraremos em contato em breve.');
    setShowContactForm(false);
    setContactForm({ nome: '', email: '', telefone: '', mensagem: '' });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ElegantHeader />
      
      {/* Spacer para o header fixo */}
      <div className="h-20"></div>
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-red-600">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigate('/busca')} className="hover:text-red-600">
              Busca
            </button>
            <span>/</span>
            <span className="text-gray-900">{imovel.titulo}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={imovel.fotos[currentImageIndex]}
                    alt={imovel.titulo}
                    className="w-full h-96 object-cover rounded-t-xl"
                  />
                  {imovel.destaque && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        Destaque
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {imovel.fotos.length}
                    </span>
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="p-4">
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {imovel.fotos.map((foto, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative overflow-hidden rounded-lg ${
                          currentImageIndex === index 
                            ? 'ring-2 ring-red-600' 
                            : 'hover:opacity-80'
                        }`}
                      >
                        <img
                          src={foto}
                          alt={`${imovel.titulo} - Foto ${index + 1}`}
                          className="w-full h-16 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Property Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{imovel.titulo}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{imovel.localizacao.bairro}, {imovel.localizacao.cidade} - {imovel.localizacao.estado}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-600">
                      {formatarPreco(imovel.preco)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Código: {imovel.id}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Characteristics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Características</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Bed className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{imovel.caracteristicas.quartos}</div>
                      <div className="text-sm text-gray-600">Quartos</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Bed className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{imovel.caracteristicas.suites}</div>
                      <div className="text-sm text-gray-600">Suítes</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Bath className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{imovel.caracteristicas.banheiros}</div>
                      <div className="text-sm text-gray-600">Banheiros</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Square className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">{formatarArea(imovel.areaTotal)}</div>
                      <div className="text-sm text-gray-600">Área Total</div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Features */}
                {imovel.areaUtil && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <HomeIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Área Útil: {formatarArea(imovel.areaUtil)}
                      </span>
                    </div>
                  </div>
                )}
                
                {imovel.caracteristicas.vagasGaragem && imovel.caracteristicas.vagasGaragem > 0 && (
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {imovel.caracteristicas.vagasGaragem} vaga(s) de garagem
                    </span>
                  </div>
                )}
                
                {/* Amenities */}
                {imovel.comodidades.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Comodidades</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {imovel.comodidades.map(comodidade => (
                        <div key={comodidade} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                          <span className="text-sm text-gray-700">{comodidade}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Descrição</h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {imovel.descricao}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Entre em Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Tem interesse neste imóvel? Entre em contato conosco!
                  </p>
                  
                  <Button 
                    className="w-full mb-3"
                    onClick={() => setShowContactForm(!showContactForm)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Tenho Interesse
                  </Button>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>(19) 99999-9999</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>contato@santanaterras.com.br</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Visitações: Seg-Sex 9h-18h</span>
                    </div>
                  </div>
                </div>
                
                {showContactForm && (
                  <form onSubmit={handleContactSubmit} className="space-y-3 pt-4 border-t">
                    <Input
                      type="text"
                      placeholder="Seu nome"
                      value={contactForm.nome}
                      onChange={(e) => setContactForm(prev => ({ ...prev, nome: e.target.value }))}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Seu email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    <Input
                      type="tel"
                      placeholder="Seu telefone"
                      value={contactForm.telefone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, telefone: e.target.value }))}
                      required
                    />
                    <textarea
                      placeholder="Mensagem (opcional)"
                      value={contactForm.mensagem}
                      onChange={(e) => setContactForm(prev => ({ ...prev, mensagem: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <Button type="submit" className="w-full">
                      Enviar Mensagem
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
            
            {/* Property Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Código:</span>
                  <span className="font-medium">{imovel.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium">{imovel.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Área Total:</span>
                  <span className="font-medium">{formatarArea(imovel.areaTotal)}</span>
                </div>
                {imovel.areaUtil && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Área Útil:</span>
                    <span className="font-medium">{formatarArea(imovel.areaUtil)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Visualizações:</span>
                  <span className="font-medium">{imovel.visualizacoes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Publicado:</span>
                  <span className="font-medium">{formatarData(imovel.dataCriacao)}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Share Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Favoritar
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
