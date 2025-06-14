
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, User, Bell, Shield, 
  Palette, Database, Zap, HelpCircle,
  Save, Eye, EyeOff, Upload, Download,
  Users, Building, CreditCard, Key,
  Menu, X, Home, Car, Wrench, Package, Calendar, Brain, BarChart3, Search
} from 'lucide-react';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    lowStock: true,
    newOrders: true,
    maintenance: true
  });

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: false },
    { name: 'Clientes', href: '/customers', icon: Users, current: false },
    { name: 'Veículos', href: '/vehicles', icon: Car, current: false },
    { name: 'Ordens de Serviço', href: '/service-orders', icon: Wrench, current: false },
    { name: 'Estoque', href: '/inventory', icon: Package, current: false },
    { name: 'Agenda', href: '/appointments', icon: Calendar, current: false },
    { name: 'IA Assistant', href: '/ai-assistant', icon: Brain, current: false },
    { name: 'Relatórios', href: '/reports', icon: BarChart3, current: false },
    { name: 'Configurações', href: '/settings', icon: SettingsIcon, current: true },
  ];

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'workshop', label: 'Oficina', icon: Building },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'integrations', label: 'Integrações', icon: Zap },
    { id: 'billing', label: 'Faturamento', icon: CreditCard }
  ];

  const ProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-satoshi font-semibold text-torqx-primary mb-4">
          Informações Pessoais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              defaultValue="João Silva"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue="joao@oficina.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              defaultValue="(11) 99999-9999"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo
            </label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all">
              <option value="owner">Proprietário</option>
              <option value="manager">Gerente</option>
              <option value="technician">Técnico</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-satoshi font-semibold text-torqx-primary mb-4">
          Foto do Perfil
        </h3>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <button className="flex items-center px-4 py-2 bg-torqx-secondary/10 text-torqx-secondary rounded-lg hover:bg-torqx-secondary/20 transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Alterar Foto
            </button>
            <p className="text-sm text-gray-500 mt-1">
              JPG, PNG até 2MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const WorkshopTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-satoshi font-semibold text-torqx-primary mb-4">
          Informações da Oficina
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Oficina
            </label>
            <input
              type="text"
              defaultValue="Auto Center Silva"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CNPJ
            </label>
            <input
              type="text"
              defaultValue="12.345.678/0001-90"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço Completo
            </label>
            <input
              type="text"
              defaultValue="Rua das Oficinas, 123 - Centro - São Paulo/SP"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone Comercial
            </label>
            <input
              type="tel"
              defaultValue="(11) 3333-4444"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Comercial
            </label>
            <input
              type="email"
              defaultValue="contato@autocentrosilva.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-satoshi font-semibold text-torqx-primary mb-4">
          Horário de Funcionamento
        </h3>
        <div className="space-y-3">
          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(day => (
            <div key={day} className="flex items-center space-x-4">
              <div className="w-20">
                <span className="text-sm font-medium text-gray-700">{day}</span>
              </div>
              <input
                type="time"
                defaultValue={day === 'Domingo' ? '' : '08:00'}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
              />
              <span className="text-gray-500">às</span>
              <input
                type="time"
                defaultValue={day === 'Domingo' ? '' : '18:00'}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={day !== 'Domingo'}
                  className="mr-2 text-torqx-secondary focus:ring-torqx-secondary"
                />
                <span className="text-sm text-gray-600">Aberto</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-satoshi font-semibold text-torqx-primary mb-4">
          Alterar Senha
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha Atual
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nova Senha
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'workshop': return <WorkshopTab />;
      case 'security': return <SecurityTab />;
      default: return (
        <div className="text-center py-12">
          <SettingsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Em Desenvolvimento</h3>
          <p className="text-gray-500">Esta seção está sendo desenvolvida</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out rounded-r-2xl ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-torqx-primary font-satoshi">Torqx</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-torqx-secondary text-white'
                    : 'text-gray-700 hover:text-torqx-primary hover:bg-gray-50'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${
                  item.current ? 'text-white' : 'text-gray-400 group-hover:text-torqx-primary'
                }`} />
                {item.name}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="w-full">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 mr-2"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-torqx-primary font-satoshi">
                Configurações
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-torqx-secondary focus:border-transparent"
                  placeholder="Buscar configurações..."
                />
              </div>

              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-torqx-secondary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">João Silva</p>
                  <p className="text-xs text-gray-500">Auto Service Silva</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <p className="text-gray-600 mt-1">
                Gerencie suas preferências e configurações da oficina
              </p>
            </div>
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white rounded-xl hover:from-torqx-secondary/90 hover:to-torqx-accent/90 transition-all mt-4 sm:mt-0">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
