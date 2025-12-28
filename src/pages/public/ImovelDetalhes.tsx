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
      <div className="h-32"></div>

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
                        className={`relative overflow-hidden rounded-lg ${currentImageIndex === index
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
                      <div className="text-lg font-bold text-gray-900">{formatarArea(imovel.areaTotal, imovel.unidadeArea)}</div>
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
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-900 p-6 text-center">
                <h3 className="text-xl font-serif text-white mb-2">Ficou Interessado?</h3>
                <p className="text-gray-400 text-sm">Entre em contato agora mesmo para agendar uma visita.</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Botão de Destaque - WhatsApp Principal */}
                <a
                  href="https://wa.me/5515997081268"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <div className="bg-white/20 p-2 rounded-full mr-3 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block text-xs font-normal opacity-90">Falar Agora</span>
                    <span className="block text-lg">WhatsApp</span>
                  </div>
                </a>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">Outros Contatos</h4>

                  <div className="grid gap-3">
                    <a href="tel:15997081268" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-100 hover:border-red-100">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mr-3 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500 font-medium">Celular / WhatsApp</span>
                        <span className="block text-gray-900 font-bold group-hover:text-red-700 font-mono">(15) 99708-1268</span>
                      </div>
                    </a>

                    <a href="tel:15991969082" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-100 hover:border-red-100">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mr-3 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500 font-medium">Celular / WhatsApp</span>
                        <span className="block text-gray-900 font-bold group-hover:text-red-700 font-mono">(15) 99196-9082</span>
                      </div>
                    </a>

                    <a href="tel:1532623368" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-100 hover:border-red-100">
                      <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mr-3 group-hover:bg-gray-600 group-hover:text-white transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500 font-medium">Telefone Fixo</span>
                        <span className="block text-gray-900 font-bold group-hover:text-gray-900 font-mono">(15) 3262-3368</span>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Nosso Endereço</span>
                      <span className="text-sm text-gray-700 leading-relaxed block">
                        Av. Monsenhor Seckler, 1648<br />
                        Vila América - Porto Feliz/SP
                      </span>
                    </div>
                  </div>
                </div>

                {showContactForm ? (
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
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="w-full text-sm text-gray-500 hover:text-gray-700 mt-2"
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                  >
                    Enviar e-mail para a imobiliária
                  </button>
                )}
              </div>
            </div>

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
                  <span className="font-medium">{formatarArea(imovel.areaTotal, imovel.unidadeArea)}</span>
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
