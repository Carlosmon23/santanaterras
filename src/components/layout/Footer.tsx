import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { logoUrl, logoAlt } from '@/config/logo';
import webrapidaLogo from '../../assets/webrapida-logo.png';

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
              <div className="flex items-start space-x-2">
                <Phone className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div className="flex flex-col space-y-1">
                  <span className="text-gray-300">(15) 99708-1268</span>
                  <span className="text-gray-300">(15) 99196-9082</span>
                  <span className="text-gray-300">(15) 3262-3368</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-red-500" />
                <span className="text-gray-300">contato@santanaterras.com.br</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <span className="text-gray-300">Av. Monsenhor Seckler, 1648 - Vila América - Porto Feliz/SP</span>
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
        <div className="border-t border-gray-800 mt-8 pt-8 text-center bg-gray-900 pb-2">
          <p className="text-gray-400">
            © 2024 Santana Terras. Todos os direitos reservados.
          </p>
          <div className="flex flex-col items-center justify-center mt-6 space-y-2">
            <span className="text-gray-500 text-xs uppercase tracking-wider">Desenvolvido por</span>
            <a
              href="https://webrapida.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src={webrapidaLogo}
                alt="Web Rápida - Criação de Sites"
                className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
