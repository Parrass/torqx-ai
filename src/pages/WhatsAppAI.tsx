
import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, Bot, Settings as SettingsIcon, BarChart3, 
  Users, Clock, CheckCircle, AlertCircle,
  Play, Pause, RefreshCw, Download,
  Phone, Calendar, Zap, Brain,
  Send, Mic, MicOff, Plus, Edit,
  Trash2, Eye, Copy, ExternalLink,
  Menu, X, Home, Car, Wrench, Package, Bell, Search, User
} from 'lucide-react';

const WhatsAppAI = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [botStatus, setBotStatus] = useState('active'); // active, paused, training
  const [activeTab, setActiveTab] = useState('overview');
  const [conversations, setConversations] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [showTrainingModal, setShowTrainingModal] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: false },
    { name: 'Clientes', href: '/customers', icon: Users, current: false },
    { name: 'Veículos', href: '/vehicles', icon: Car, current: false },
    { name: 'Ordens de Serviço', href: '/service-orders', icon: Wrench, current: false },
    { name: 'Estoque', href: '/inventory', icon: Package, current: false },
    { name: 'Agenda', href: '/appointments', icon: Calendar, current: false },
    { name: 'IA Assistant', href: '/ai-assistant', icon: Brain, current: false },
    { name: 'IA WhatsApp', href: '/whatsapp-ai', icon: MessageCircle, current: true },
    { name: 'Relatórios', href: '/reports', icon: BarChart3, current: false },
    { name: 'Configurações', href: '/settings', icon: SettingsIcon, current: false },
  ];

  // Mock data para demonstração
  useEffect(() => {
    const mockConversations = [
      {
        id: '1',
        customer_name: 'Maria Silva',
        phone: '+55 11 99999-9999',
        last_message: 'Preciso trocar o óleo do meu carro',
        timestamp: new Date(Date.now() - 300000), // 5 min atrás
        status: 'ai_handled',
        messages_count: 8,
        appointment_scheduled: true,
        satisfaction: 5
      },
      {
        id: '2',
        customer_name: 'João Santos',
        phone: '+55 11 88888-8888',
        last_message: 'Qual o preço da revisão completa?',
        timestamp: new Date(Date.now() - 900000), // 15 min atrás
        status: 'pending_human',
        messages_count: 3,
        appointment_scheduled: false,
        satisfaction: null
      },
      {
        id: '3',
        customer_name: 'Ana Costa',
        phone: '+55 11 77777-7777',
        last_message: 'Obrigada! Agendamento confirmado para amanhã às 14h',
        timestamp: new Date(Date.now() - 1800000), // 30 min atrás
        status: 'completed',
        messages_count: 12,
        appointment_scheduled: true,
        satisfaction: 5
      }
    ];

    const mockMetrics = {
      total_conversations: 156,
      ai_resolution_rate: 78,
      avg_response_time: 12, // segundos
      appointments_scheduled: 34,
      customer_satisfaction: 4.6,
      active_conversations: 8
    };

    setConversations(mockConversations);
    setMetrics(mockMetrics);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ai_handled': return 'text-torqx-accent bg-torqx-accent/10';
      case 'pending_human': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-torqx-secondary bg-torqx-secondary/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ai_handled': return 'IA Resolveu';
      case 'pending_human': return 'Aguarda Humano';
      case 'completed': return 'Finalizada';
      default: return 'Indefinido';
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isConnected ? 'bg-torqx-accent/10' : 'bg-red-100'
            }`}>
              <MessageCircle className={`w-6 h-6 ${
                isConnected ? 'text-torqx-accent' : 'text-red-600'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-satoshi font-semibold text-torqx-primary">
                WhatsApp Business
              </h3>
              <p className={`text-sm ${
                isConnected ? 'text-torqx-accent' : 'text-red-600'
              }`}>
                {isConnected ? 'Conectado • +55 11 3333-4444' : 'Desconectado'}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {isConnected ? (
              <>
                <button
                  onClick={() => setBotStatus(botStatus === 'active' ? 'paused' : 'active')}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    botStatus === 'active'
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-torqx-accent/10 text-torqx-accent hover:bg-torqx-accent/20'
                  }`}
                >
                  {botStatus === 'active' ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pausar IA
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Ativar IA
                    </>
                  )}
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Configurar
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsConnected(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white rounded-lg hover:from-torqx-secondary/90 hover:to-torqx-accent/90 transition-all"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Conectar WhatsApp
              </button>
            )}
          </div>
        </div>

        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                botStatus === 'active' ? 'bg-torqx-accent' : 'bg-yellow-500'
              }`}></div>
              <p className="text-sm font-medium text-gray-900">
                {botStatus === 'active' ? 'IA Ativa' : 'IA Pausada'}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-torqx-primary">{metrics.active_conversations}</p>
              <p className="text-sm text-gray-600">Conversas Ativas</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-torqx-primary">{metrics.avg_response_time}s</p>
              <p className="text-sm text-gray-600">Tempo Resposta</p>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversas Hoje</p>
              <p className="text-2xl font-bold text-torqx-primary">{metrics.total_conversations}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-torqx-secondary" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Resolução IA</p>
              <p className="text-2xl font-bold text-torqx-accent">{metrics.ai_resolution_rate}%</p>
            </div>
            <Bot className="w-8 h-8 text-torqx-accent" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agendamentos</p>
              <p className="text-2xl font-bold text-torqx-primary">{metrics.appointments_scheduled}</p>
            </div>
            <Calendar className="w-8 h-8 text-torqx-secondary" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Satisfação</p>
              <p className="text-2xl font-bold text-torqx-accent">{metrics.customer_satisfaction}/5</p>
            </div>
            <div className="flex">
              {[1,2,3,4,5].map(star => (
                <div key={star} className={`w-2 h-2 rounded-full mr-1 ${
                  star <= Math.floor(metrics.customer_satisfaction) ? 'bg-yellow-400' : 'bg-gray-200'
                }`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-satoshi font-semibold text-torqx-primary">
            Conversas Recentes
          </h3>
          <button className="text-torqx-secondary hover:text-torqx-secondary/80 text-sm font-medium">
            Ver Todas
          </button>
        </div>
        <div className="space-y-4">
          {conversations.slice(0, 3).map(conv => (
            <div key={conv.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{conv.customer_name}</h4>
                  <p className="text-sm text-gray-600">{conv.last_message}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conv.status)}`}>
                  {getStatusText(conv.status)}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {conv.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TrainingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-satoshi font-bold text-torqx-primary">
            Nova Resposta da IA
          </h2>
        </div>
        <div className="p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all">
                <option value="">Selecione a categoria</option>
                <option value="agendamentos">Agendamentos</option>
                <option value="precos">Preços e Orçamentos</option>
                <option value="servicos">Serviços Oferecidos</option>
                <option value="horario">Horário de Funcionamento</option>
                <option value="localizacao">Localização</option>
                <option value="tecnicas">Dúvidas Técnicas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pergunta do Cliente
              </label>
              <input
                type="text"
                placeholder="Ex: Qual o preço da troca de óleo?"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resposta da IA
              </label>
              <textarea
                rows={4}
                placeholder="Ex: A troca de óleo custa a partir de R$ 80, dependendo do tipo de óleo. Gostaria de agendar um horário?"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palavras-chave (opcional)
              </label>
              <input
                type="text"
                placeholder="óleo, troca, manutenção, preço"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separe as palavras-chave com vírgulas
              </p>
            </div>
          </form>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={() => setShowTrainingModal(false)}
            className="px-6 py-3 text-gray-700 hover:text-torqx-primary transition-colors"
          >
            Cancelar
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white rounded-xl hover:from-torqx-secondary/90 hover:to-torqx-accent/90 transition-all">
            Salvar Resposta
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'conversations', label: 'Conversas', icon: MessageCircle },
    { id: 'training', label: 'Treinamento', icon: Brain },
    { id: 'settings', label: 'Configurações', icon: SettingsIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'conversations': 
      case 'training': 
      case 'settings': 
        return (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Em Desenvolvimento</h3>
            <p className="text-gray-500">Esta seção está sendo desenvolvida</p>
          </div>
        );
      default: return <OverviewTab />;
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
                IA do WhatsApp
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
                  placeholder="Buscar conversas..."
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
                Gerencie seu assistente virtual inteligente
              </p>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Relatório
              </button>
              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white rounded-xl hover:from-torqx-secondary/90 hover:to-torqx-accent/90 transition-all">
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir WhatsApp
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-torqx-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          {renderTabContent()}

          {/* Training Modal */}
          {showTrainingModal && <TrainingModal />}
        </main>
      </div>
    </div>
  );
};

export default WhatsAppAI;
