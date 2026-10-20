import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { logoUrl, logoAlt } from '@/config/logo';

interface ElegantHeaderProps {
  className?: string;
}

export const ElegantHeader: React.FC<ElegantHeaderProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Verificar se está na página de detalhes do imóvel
  const isImovelDetalhes = location.pathname.startsWith('/imovel/');

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/busca', label: 'Buscar' },
    { path: '/contato', label: 'Contato' },
  ];

  // Se estiver na página de detalhes, sempre usar fundo branco sólido
  const headerBg = isImovelDetalhes
    ? 'bg-white shadow-md'
    : (isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent');

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      headerBg,
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo + CRECI */}
          <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center">
            <div className={cn(
              'flex items-center justify-center transition-all duration-300',
              isImovelDetalhes || isScrolled
                ? 'bg-transparent'
                : 'bg-white shadow-lg rounded-xl px-4 py-2'
            )}>
              <img
                src={logoUrl}
                alt={logoAlt}
                className={cn(
                  'w-auto object-contain transition-all duration-300',
                  isImovelDetalhes || isScrolled ? 'h-20' : 'h-24'
                )}
                loading="eager"
                decoding="async"
              />
            </div>
          </Link>

          {/* CRECI */}
          <span className={cn(
            'hidden xl:inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-300',
            isImovelDetalhes || isScrolled
              ? 'border-gray-300 text-gray-600'
              : 'border-white/40 text-white/90 backdrop-blur-sm bg-white/10'
          )}>
            CRECI 30683-F
          </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'font-medium transition-colors relative group',
                  isActive(item.path)
                    ? (isImovelDetalhes || isScrolled ? 'text-red-600' : 'text-white')
                    : (isImovelDetalhes || isScrolled ? 'text-gray-700 hover:text-red-600' : 'text-white/80 hover:text-white')
                )}
              >
                {item.label}
                <span className={cn(
                  'absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full',
                  isActive(item.path)
                    ? (isImovelDetalhes || isScrolled ? 'bg-red-600 w-full' : 'bg-white w-full')
                    : (isImovelDetalhes || isScrolled ? 'bg-red-600' : 'bg-white/60')
                )}></span>
              </Link>
            ))}
          </nav>

          {/* Login */}
          <Link
            to="/admin"
            className={cn(
              'hidden lg:flex items-center gap-1.5 text-sm font-medium transition-colors',
              isImovelDetalhes || isScrolled
                ? 'text-gray-500 hover:text-red-600'
                : 'text-white/70 hover:text-white'
            )}
          >
            <User className="w-4 h-4" />
            <span>Login</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              'lg:hidden p-2 rounded-lg transition-colors',
              isImovelDetalhes || isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            )}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={cn(
            'lg:hidden border-t',
            isImovelDetalhes || isScrolled ? 'border-gray-200' : 'border-white/20'
          )}>
            <nav className="py-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-lg font-medium transition-colors',
                    isActive(item.path)
                      ? (isImovelDetalhes || isScrolled ? 'text-red-600 bg-red-50' : 'text-red-400 bg-white/10')
                      : (isImovelDetalhes || isScrolled ? 'text-gray-700 hover:text-red-600 hover:bg-gray-50' : 'text-white/80 hover:text-white hover:bg-white/10')
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                  isImovelDetalhes || isScrolled ? 'text-gray-500 hover:text-red-600' : 'text-white/70 hover:text-white'
                )}
              >
                <User className="w-4 h-4" />
                Login
              </Link>
              <p className={cn(
                'pt-3 text-center text-xs font-semibold tracking-[0.15em] uppercase',
                isImovelDetalhes || isScrolled ? 'text-gray-500' : 'text-white/70'
              )}>
                CRECI 30683-F
              </p>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
