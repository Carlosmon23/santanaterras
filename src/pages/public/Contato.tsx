import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useLeadStore } from '@/stores/leadStore';
import { ElegantHeader } from '@/components/layout/ElegantHeader';

export const Contato: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addLead } = useLeadStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mapAssunto: Record<string, 'Visita' | 'Informações' | 'Proposta'> = {
      visita: 'Visita',
      informacao: 'Informações',
      compra: 'Proposta',
      venda: 'Proposta',
      outro: 'Informações'
    };
    await addLead({
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      mensagem: `${formData.assunto ? `[${formData.assunto}] ` : ''}${formData.mensagem}`,
      imovelId: undefined,
      tipoInteresse: mapAssunto[formData.assunto] || 'Informações'
    });
    setShowSuccess(true);
    setIsSubmitting(false);

    // Limpar formulário após 3 segundos
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ElegantHeader />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Entre em Contato</h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Estamos aqui para ajudar você a encontrar o imóvel ideal — rural e urbano
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Informações de Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Telefones</h3>
                    <div className="flex flex-col text-gray-600">
                      <span>(15) 99708-1268</span>
                      <span>(15) 99196-9082</span>
                      <span>(15) 3262-3368</span>
                    </div>
                    <p className="text-sm text-gray-500">WhatsApp disponível</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">contato@santanaterras.com.br</p>
                    <p className="text-sm text-gray-500">Resposta em até 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Endereço</h3>
                    <p className="text-gray-600">Av. Monsenhor Seckler, 1648</p>
                    <p className="text-gray-600">Vila América - Porto Feliz/SP</p>
                    <p className="text-sm text-gray-500">Atendimento presencial com hora marcada</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Horário de Atendimento</h3>
                    <p className="text-gray-600">Segunda a Sexta</p>
                    <p className="text-sm text-gray-500">9h às 18h</p>
                    <p className="text-gray-600">Sábado</p>
                    <p className="text-sm text-gray-500">9h às 13h</p>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/5515997081268"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <MessageCircle className="w-5 h-5" />
                  Falar no WhatsApp
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Envie sua Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                {showSuccess ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Mensagem Enviada!</h3>
                    <p className="text-gray-600 mb-4">
                      Obrigado pelo contato. Responderemos em breve.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Nome Completo"
                        type="text"
                        value={formData.nome}
                        onChange={(e) => handleInputChange('nome', e.target.value)}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Telefone"
                        type="tel"
                        value={formData.telefone}
                        onChange={(e) => handleInputChange('telefone', e.target.value)}
                        required
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assunto
                        </label>
                        <select
                          value={formData.assunto}
                          onChange={(e) => handleInputChange('assunto', e.target.value)}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="">Selecione um assunto</option>
                          <option value="compra">Quero comprar um imóvel</option>
                          <option value="venda">Quero vender meu imóvel</option>
                          <option value="informacao">Informações sobre imóveis</option>
                          <option value="visita">Agendar visita</option>
                          <option value="outro">Outro assunto</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mensagem
                      </label>
                      <textarea
                        value={formData.mensagem}
                        onChange={(e) => handleInputChange('mensagem', e.target.value)}
                        rows={6}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Digite sua mensagem aqui..."
                      />
                    </div>

                    <Button
                      type="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Enviar Mensagem
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Por que escolher a Santana Terras?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Experiência e Conhecimento</h3>
                  <p className="text-gray-600">
                    Com anos de experiência no mercado de imóveis rurais, conhecemos profundamente
                    cada região e as particularidades de cada tipo de propriedade.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Atendimento Personalizado</h3>
                  <p className="text-gray-600">
                    Cada cliente é único. Oferecemos um atendimento personalizado, entendendo
                    suas necessidades específicas para encontrar o imóvel ideal.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Transparência e Segurança</h3>
                  <p className="text-gray-600">
                    Trabalhamos com total transparência em todas as etapas do processo,
                    garantindo segurança e tranquilidade para nossos clientes.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Suporte Completo</h3>
                  <p className="text-gray-600">
                    Do primeiro contato à finalização da compra ou venda, oferecemos
                    suporte completo em todas as etapas do processo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
