
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
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Navegação Principal</h3>
          <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-torqx-secondary to-torqx-secondary-dark rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="ml-3 text-xl font-bold text-torqx-primary">Torqx</span>
              </div>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <span className="text-xl">☰</span>
              </button>
              
              <div className="hidden md:flex space-x-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === item.id
                        ? 'bg-torqx-secondary text-white'
                        : 'text-gray-600 hover:text-torqx-primary hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            
            {isMobileMenuOpen && (
              <div className="md:hidden border-t border-gray-100 pt-4 mt-4">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                        activeTab === item.id
                          ? 'bg-torqx-secondary text-white'
                          : 'text-gray-600 hover:text-torqx-primary hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Breadcrumbs</h3>
          <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <a href="#" className="text-torqx-secondary hover:text-torqx-secondary-dark font-medium">
                  Home
                </a>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <a href="#" className="text-torqx-secondary hover:text-torqx-secondary-dark font-medium">
                  Oficinas
                </a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-600 font-medium">Nova Oficina</li>
            </ol>
          </nav>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Paginação</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando <span className="font-medium">1-10</span> de <span className="font-medium">97</span> resultados
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
                  Anterior
                </button>
                <button className="px-3 py-2 rounded-lg bg-torqx-secondary text-white font-medium">1</button>
                <button className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">2</button>
                <button className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">3</button>
                <span className="px-2 text-gray-400">...</span>
                <button className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">10</button>
                <button className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                  Próximo
                </button>
              </div>
            </div>
          </div>
        </div>

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
      </div>
    </section>
  );
};

export default Navigation;
