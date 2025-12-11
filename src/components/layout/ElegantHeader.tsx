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
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className={cn(
              'flex items-center justify-center rounded-lg px-1 py-0.5 transition-colors overflow-hidden',
              isImovelDetalhes || isScrolled ? 'bg-white' : 'bg-white/90 backdrop-blur-sm'
            )}>
              <img
                src={logoUrl}
                alt={logoAlt}
                className="h-24 w-auto"
                loading="eager"
                decoding="async"
              />
            </div>
          </Link>
          
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
          
          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/admin"
              className={cn(
                'flex items-center space-x-2 px-6 py-2.5 rounded-full font-medium transition-all',
                isImovelDetalhes || isScrolled
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm'
              )}
            >
              <User className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>
          
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
                  'block px-4 py-3 rounded-lg font-medium transition-colors',
                  isImovelDetalhes || isScrolled
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-white/90 text-gray-900 hover:bg-white'
                )}
              >
                Admin
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
