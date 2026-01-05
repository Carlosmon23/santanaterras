import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Footer } from './components/layout/Footer';
import { ElegantHome } from './pages/public/ElegantHome';
import { ElegantBuscaImoveis } from './pages/public/ElegantBuscaImoveis';
import { ImovelDetalhes } from './pages/public/ImovelDetalhes';
import { Contato } from './pages/public/Contato';
import { AdminLogin } from './pages/admin/AdminLogin';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminImoveis } from './pages/admin/AdminImoveis';
import { AdminLeads } from './pages/admin/AdminLeads';
import { AdminConfiguracoes } from './pages/admin/AdminConfiguracoes';
import { AdminImovelForm } from './pages/admin/AdminImovelForm';
import { AdminHeroImages } from './pages/admin/AdminHeroImages';
import { AdminLogo } from './pages/admin/AdminLogo';
import { useImovelStore } from './stores/imovelStore';
import { useAuthStore } from './stores/authStore';
import { Phone } from 'lucide-react';

function App() {
  const { loadImoveis } = useImovelStore();
  const { checkAuth } = useAuthStore();

  React.useEffect(() => {
    // Verificar autenticação ao carregar o app
    checkAuth();
    // Carregar imóveis
    loadImoveis();
  }, [checkAuth, loadImoveis]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/*" element={
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<ElegantHome />} />
                  <Route path="/busca" element={<ElegantBuscaImoveis />} />
                  <Route path="/imovel/:slug" element={<ImovelDetalhes />} />
                  <Route path="/contato" element={<Contato />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="imoveis" element={<AdminImoveis />} />
            <Route path="imoveis/novo" element={<AdminImovelForm />} />
            <Route path="imoveis/editar/:id" element={<AdminImovelForm />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="configuracoes" element={<AdminConfiguracoes />} />
            <Route path="hero-images" element={<AdminHeroImages />} />
            <Route path="logo" element={<AdminLogo />} />
          </Route>
        </Routes>
        <a
          href="https://wa.me/5515997081268"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-600 text-white shadow-xl flex items-center justify-center hover:bg-green-700 transition-colors"
        >
          <Phone className="w-6 h-6" />
        </a>
      </div>
    </BrowserRouter>
  );
}

export default App;
