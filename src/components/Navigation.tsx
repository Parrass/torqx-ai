
import React, { useState } from 'react';

const Navigation = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'oficinas', label: 'Oficinas', icon: '🔧' },
    { id: 'clientes', label: 'Clientes', icon: '👥' },
    { id: 'servicos', label: 'Serviços', icon: '🚗' },
    { id: 'relatorios', label: 'Relatórios', icon: '📈' }
  ];

  return (
    <section id="navigation" className="component-section mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold text-torqx-primary mb-8">🧭 Navegação</h2>
      
      {/* Navbar */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Navbar</h3>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-torqx-secondary to-torqx-secondary-dark rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="ml-3 text-xl font-bold text-torqx-primary">Torqx</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-torqx-primary font-semibold">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-torqx-primary">Clientes</a>
              <a href="#" className="text-gray-600 hover:text-torqx-primary">Ordens</a>
              <a href="#" className="text-gray-600 hover:text-torqx-primary">Estoque</a>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-torqx-primary">🔔</button>
              <div className="w-8 h-8 bg-torqx-accent rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">JS</span>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Breadcrumb</h3>
        <nav className="flex items-center space-x-2 text-sm">
          <a href="#" className="text-torqx-secondary hover:text-torqx-secondary-dark">Dashboard</a>
          <span className="text-gray-400">/</span>
          <a href="#" className="text-torqx-secondary hover:text-torqx-secondary-dark">Clientes</a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">João Silva</span>
        </nav>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Tabs</h3>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <a href="#" className="border-b-2 border-torqx-secondary text-torqx-secondary py-2 px-1 font-semibold">
              Informações
            </a>
            <a href="#" className="border-b-2 border-transparent text-gray-600 hover:text-torqx-primary py-2 px-1">
              Veículos
            </a>
            <a href="#" className="border-b-2 border-transparent text-gray-600 hover:text-torqx-primary py-2 px-1">
              Histórico
            </a>
            <a href="#" className="border-b-2 border-transparent text-gray-600 hover:text-torqx-primary py-2 px-1">
              Configurações
            </a>
          </nav>
        </div>
      </div>

      {/* Paginação */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Paginação</h3>
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Mostrando</span>
            <span className="font-semibold text-torqx-primary">1-10</span>
            <span className="text-sm text-gray-600">de</span>
            <span className="font-semibold text-torqx-primary">97</span>
            <span className="text-sm text-gray-600">resultados</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button className="px-3 py-2 text-gray-400 hover:text-torqx-primary disabled:opacity-50" disabled>
              ← Anterior
            </button>
            <button className="px-3 py-2 bg-torqx-secondary text-white rounded-lg">1</button>
            <button className="px-3 py-2 text-gray-600 hover:text-torqx-primary hover:bg-gray-100 rounded-lg">2</button>
            <button className="px-3 py-2 text-gray-600 hover:text-torqx-primary hover:bg-gray-100 rounded-lg">3</button>
            <span className="px-3 py-2 text-gray-400">...</span>
            <button className="px-3 py-2 text-gray-600 hover:text-torqx-primary hover:bg-gray-100 rounded-lg">10</button>
            <button className="px-3 py-2 text-torqx-secondary hover:text-torqx-secondary-dark">
              Próximo →
            </button>
          </div>
        </nav>
      </div>

      {/* Sidebar */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Sidebar</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex h-64">
            <aside className="w-64 bg-torqx-primary text-white p-6">
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 bg-torqx-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="ml-3 font-bold">Torqx Admin</span>
              </div>
              <nav className="space-y-2">
                {navItems.slice(0, 4).map((item) => (
                  <a
                    key={item.id}
                    href="#"
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-torqx-primary-light transition-colors"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </a>
                ))}
              </nav>
            </aside>
            <div className="flex-1 p-6 bg-gray-50">
              <h4 className="text-lg font-semibold text-torqx-primary mb-2">Conteúdo Principal</h4>
              <p className="text-gray-600">Esta seria a área de conteúdo principal da aplicação.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Navigation;
