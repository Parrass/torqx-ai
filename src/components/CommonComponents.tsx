
import React, { useState } from 'react';
import { Menu, Bell, Search, User, Settings, Home, Users, Car, FileText, BarChart3, Package, Calendar, HelpCircle, LogOut } from 'lucide-react';

const CommonComponents = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <section id="common-components" className="component-section mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold text-torqx-primary mb-8">🧩 Componentes Comuns</h2>
      
      {/* Navbar Padrão da Aplicação */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Navbar da Aplicação</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <nav className="bg-white border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo e Menu Toggle */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-torqx-secondary to-torqx-secondary-dark rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">T</span>
                  </div>
                  <span className="ml-3 text-xl font-bold text-torqx-primary">Torqx</span>
                </div>
              </div>

              {/* Busca */}
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar clientes, OS, veículos..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-torqx-secondary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                </button>
                
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-semibold text-torqx-primary">João Silva</div>
                    <div className="text-xs text-gray-600">Proprietário</div>
                  </div>
                  <div className="w-10 h-10 bg-torqx-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">JS</span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Sidebar */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Sidebar da Aplicação</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex h-96">
            {/* Sidebar */}
            <div className={`bg-torqx-primary text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
              <div className="p-4">
                {/* Navigation Items */}
                <nav className="space-y-2 mt-4">
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-torqx-secondary text-white">
                    <Home className="w-5 h-5" />
                    {isSidebarOpen && <span>Dashboard</span>}
                  </a>
                  
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-torqx-primary-light transition-colors">
                    <Users className="w-5 h-5" />
                    {isSidebarOpen && <span>Clientes</span>}
                  </a>
                  
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-torqx-primary-light transition-colors">
                    <Car className="w-5 h-5" />
                    {isSidebarOpen && <span>Veículos</span>}
                  </a>
                  
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-torqx-primary-light transition-colors">
                    <FileText className="w-5 h-5" />
                    {isSidebarOpen && <span>Ordens de Serviço</span>}
                  </a>
                  
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-torqx-primary-light transition-colors">
                    <Package className="w-5 h-5" />
                    {isSidebarOpen && <span>Estoque</span>}
                  </a>
                  
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-torqx-primary-light transition-colors">
                    <Calendar className="w-5 h-5" />
                    {isSidebarOpen && <span>Agendamentos</span>}
                  </a>
                  
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-torqx-primary-light transition-colors">
                    <BarChart3 className="w-5 h-5" />
                    {isSidebarOpen && <span>Relatórios</span>}
                  </a>
                </nav>

                {/* Bottom Section */}
                {isSidebarOpen && (
                  <div className="absolute bottom-4 left-4 right-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-torqx-primary-light transition-colors">
                      <Settings className="w-5 h-5" />
                      <span>Configurações</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-torqx-primary-light transition-colors">
                      <HelpCircle className="w-5 h-5" />
                      <span>Ajuda</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-red-200">
                      <LogOut className="w-5 h-5" />
                      <span>Sair</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 p-6 bg-gray-50">
              <h4 className="text-lg font-semibold text-torqx-primary mb-2">Área de Conteúdo</h4>
              <p className="text-gray-600 mb-4">Esta seria a área principal onde o conteúdo das páginas é exibido.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h5 className="font-semibold text-torqx-primary mb-2">Estatística 1</h5>
                  <div className="text-2xl font-bold text-torqx-secondary">127</div>
                  <div className="text-sm text-gray-600">OS este mês</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h5 className="font-semibold text-torqx-primary mb-2">Estatística 2</h5>
                  <div className="text-2xl font-bold text-torqx-accent">R$ 45.2k</div>
                  <div className="text-sm text-gray-600">Receita mensal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer da Aplicação */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Footer da Aplicação</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <footer className="bg-gray-50 px-6 py-8">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Logo e Info */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-torqx-secondary to-torqx-secondary-dark rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">T</span>
                  </div>
                  <span className="ml-3 text-lg font-bold text-torqx-primary">Torqx</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Plataforma completa para gestão inteligente de oficinas automotivas.
                </p>
                <div className="text-xs text-gray-500">
                  © 2025 Torqx. Todos os direitos reservados.
                </div>
              </div>
              
              {/* Links Rápidos */}
              <div>
                <h4 className="font-semibold text-torqx-primary mb-3">Links Rápidos</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-torqx-primary">Dashboard</a></li>
                  <li><a href="#" className="hover:text-torqx-primary">Clientes</a></li>
                  <li><a href="#" className="hover:text-torqx-primary">Ordens de Serviço</a></li>
                  <li><a href="#" className="hover:text-torqx-primary">Relatórios</a></li>
                </ul>
              </div>
              
              {/* Suporte */}
              <div>
                <h4 className="font-semibold text-torqx-primary mb-3">Suporte</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-torqx-primary">Central de Ajuda</a></li>
                  <li><a href="#" className="hover:text-torqx-primary">Documentação</a></li>
                  <li><a href="#" className="hover:text-torqx-primary">Contato</a></li>
                  <li><a href="#" className="hover:text-torqx-primary">Status do Sistema</a></li>
                </ul>
              </div>
              
              {/* Contato */}
              <div>
                <h4 className="font-semibold text-torqx-primary mb-3">Contato</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>📧 suporte@torqx.com.br</div>
                  <div>📱 (11) 99999-9999</div>
                  <div>🕒 Seg-Sex 8h às 18h</div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Empty States */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Empty States</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Empty State 1 - Lista Vazia */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-torqx-primary mb-2">Nenhum cliente cadastrado</h4>
            <p className="text-gray-600 mb-6">Comece cadastrando seu primeiro cliente para gerenciar seus veículos e serviços.</p>
            <button className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-6 py-3 rounded-xl font-semibold">
              Cadastrar Cliente
            </button>
          </div>

          {/* Empty State 2 - Busca Sem Resultados */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-torqx-primary mb-2">Nenhum resultado encontrado</h4>
            <p className="text-gray-600 mb-6">Tente ajustar os filtros ou termos de busca para encontrar o que procura.</p>
            <button className="bg-white text-torqx-primary px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:border-torqx-secondary">
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Componentes de Feedback */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Componentes de Feedback</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Success Message */}
          <div className="bg-torqx-accent/5 border border-torqx-accent/20 p-6 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-torqx-accent rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-torqx-primary mb-1">Operação realizada com sucesso!</h4>
                <p className="text-gray-600 text-sm">O cliente foi cadastrado e está disponível no sistema.</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">!</span>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Erro ao processar solicitação</h4>
                <p className="text-red-600 text-sm">Verifique os dados informados e tente novamente.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommonComponents;
