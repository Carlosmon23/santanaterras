import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Phone, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/helpers';
import { logoUrl, logoAlt } from '@/config/logo';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/busca', label: 'Buscar Imóveis', icon: Search },
    { path: '/contato', label: 'Contato', icon: Phone },
  ];
  
  return (
    <header className={cn('bg-white shadow-sm sticky top-0 z-50', className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center rounded-lg px-2 py-1 bg-white">
              <img
                src={logoUrl}
                alt={logoAlt}
                className="h-9 w-auto"
                loading="eager"
                decoding="async"
              />
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors',
                    isActive(item.path)
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* Admin Login Button */}
          <Link
            to="/admin"
            className="hidden md:flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="font-medium">Admin</span>
          </Link>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors',
                      isActive(item.path)
                        ? 'text-red-600 bg-red-50'
                        : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Admin</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
