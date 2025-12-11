import React, { useState } from 'react';
import { 
  Home, 
  TrendingUp, 
  Users, 
  Shield, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  Send,
  MessageCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export const AnuncieImovel: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipoImovel: '',
    cidade: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setShowSuccess(true);
    setIsSubmitting(false);
    
    // Limpar formulário após 3 segundos
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        tipoImovel: '',
        cidade: '',
        mensagem: ''
      });
    }, 3000);
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const beneficios = [
    {
      icon: TrendingUp,
      titulo: 'Maior Visibilidade',
      descricao: 'Seu imóvel será visto por milhares de pessoas interessadas em propriedades rurais.'
    },
    {
      icon: Users,
      titulo: 'Atendimento Personalizado',
      descricao: 'Equipe especializada para entender as características únicas do seu imóvel.'
    },
    {
      icon: Shield,
      titulo: 'Segurança e Transparência',
      descricao: 'Processo seguro e transparente do início ao fim da negociação.'
    },
    {
      icon: Home,
      titulo: 'Conhecimento do Mercado',
      descricao: 'Análise detalhada do mercado para obter o melhor preço pelo seu imóvel.'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Anuncie seu Imóvel Rural
          </h1>
          <p className="text-xl text-red-100 max-w-3xl mx-auto mb-8">
            A Santana Terras tem a experiência e o conhecimento necessários para vender 
            seu imóvel rural pelo melhor preço e no menor tempo possível.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Falar com Consultor
            </Button>
            <Button size="lg" variant="outline">
              Ver Processo
            </Button>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Benefits */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Por que escolher a Santana Terras?
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Com anos de experiência no mercado de imóveis rurais, oferecemos um serviço 
                completo e personalizado para garantir que você obtenha o melhor resultado 
                na venda do seu imóvel.
              </p>
            </div>
            
            <div className="space-y-6">
              {beneficios.map((beneficio, index) => {
                const Icon = beneficio.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {beneficio.titulo}
                      </h3>
                      <p className="text-gray-600">
                        {beneficio.descricao}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Statistics */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Nossos Números</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">500+</div>
                    <div className="text-sm text-gray-600">Imóveis Vendidos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">98%</div>
                    <div className="text-sm text-gray-600">Satisfação dos Clientes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">15+</div>
                    <div className="text-sm text-gray-600">Anos de Experiência</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">R$ 500M+</div>
                    <div className="text-sm text-gray-600">Valor em Transações</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Form */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">Quero Anunciar meu Imóvel</CardTitle>
                <p className="text-gray-600 text-sm">
                  Preencha o formulário e entraremos em contato em até 24 horas
                </p>
              </CardHeader>
              <CardContent>
                {showSuccess ? (
                  <div className="text-center py-6">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Formulário Enviado!
                    </h3>
                    <p className="text-gray-600">
                      Obrigado pelo interesse. Entraremos em contato em breve para 
                      discutir como podemos ajudar na venda do seu imóvel.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Nome Completo"
                        type="text"
                        value={formData.nome}
                        onChange={(e) => handleInputChange('nome', e.target.value)}
                        required
                      />
                      <Input
                        label="Telefone"
                        type="tel"
                        value={formData.telefone}
                        onChange={(e) => handleInputChange('telefone', e.target.value)}
                        required
                      />
                    </div>
                    
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Imóvel
                        </label>
                        <select
                          value={formData.tipoImovel}
                          onChange={(e) => handleInputChange('tipoImovel', e.target.value)}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="">Selecione o tipo</option>
                          <option value="sitio">Sítio</option>
                          <option value="chacara">Chácara</option>
                          <option value="fazenda">Fazenda</option>
                          <option value="terreno">Terreno</option>
                          <option value="casa">Casa Rural</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                      
                      <Input
                        label="Cidade/Região"
                        type="text"
                        value={formData.cidade}
                        onChange={(e) => handleInputChange('cidade', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Informações sobre o imóvel
                      </label>
                      <textarea
                        value={formData.mensagem}
                        onChange={(e) => handleInputChange('mensagem', e.target.value)}
                        rows={4}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Descreva seu imóvel: tamanho, características, localização, etc..."
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Enviar Informações
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Process Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Nosso Processo de Venda
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Avaliação</h3>
              <p className="text-gray-600">
                Análise detalhada do seu imóvel e definição do preço de mercado.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Divulgação</h3>
              <p className="text-gray-600">
                Criação de anúncio profissional com fotos e descrição detalhada.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Negociação</h3>
              <p className="text-gray-600">
                Gerenciamento de visitas e negociação com potenciais compradores.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Finalização</h3>
              <p className="text-gray-600">
                Acompanhamento completo até a conclusão da venda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};