import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { logoUrl, logoAlt } from '@/config/logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src={logoUrl}
                alt={logoAlt}
                className="h-12 w-auto"
                loading="eager"
                decoding="async"
              />
            </div>
            <p className="text-gray-300 max-w-md">
              Referência em imóveis rurais, com forte atuação também em imóveis urbanos. 
              Oferecemos as melhores oportunidades de investimento e moradia no campo e na cidade, 
              com segurança e transparência em cada negociação.
            </p>
          </div>
          
          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <nav className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/busca" className="block text-gray-300 hover:text-white transition-colors">
                Buscar Imóveis
              </Link>
              <Link to="/contato" className="block text-gray-300 hover:text-white transition-colors">
                Contato
              </Link>
            </nav>
          </div>
          
          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-red-500" />
                <span className="text-gray-300">(19) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-red-500" />
                <span className="text-gray-300">contato@santanaterras.com.br</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-red-500" />
                <span className="text-gray-300">São Pedro - SP</span>
              </div>
            </div>
            
            {/* Botão WhatsApp */}
            <a
              href="https://wa.me/19999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mt-4"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Santana Terras. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Desenvolvido com ❤️ para o melhor atendimento em imóveis rurais e urbanos
          </p>
        </div>
      </div>
    </footer>
  );
};
