
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, Bot, Settings as SettingsIcon, BarChart3, 
  Users, Clock, CheckCircle, AlertCircle,
  Play, Pause, RefreshCw, Download,
  Phone, Calendar, Zap, Brain,
  Send, Mic, MicOff, Plus, Edit,
  Trash2, Eye, Copy, ExternalLink
} from 'lucide-react';

interface Metrics {
  total_conversations: number;
  ai_resolution_rate: number;
  avg_response_time: number;
  appointments_scheduled: number;
  customer_satisfaction: number;
  active_conversations: number;
}

interface Conversation {
  id: string;
  customer_name: string;
  phone: string;
  last_message: string;
  timestamp: Date;
  status: string;
  messages_count: number;
  appointment_scheduled: boolean;
  satisfaction: number | null;
}

const WhatsAppAI = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [botStatus, setBotStatus] = useState('active'); // active, paused, training
  const [activeTab, setActiveTab] = useState('overview');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    total_conversations: 0,
    ai_resolution_rate: 0,
    avg_response_time: 0,
    appointments_scheduled: 0,
    customer_satisfaction: 0,
    active_conversations: 0
  });
  const [showTrainingModal, setShowTrainingModal] = useState(false);

  // Mock data para demonstração
  useEffect(() => {
    const mockConversations: Conversation[] = [
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

    const mockMetrics: Metrics = {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ai_handled': return 'text-torqx-accent bg-torqx-accent/10';
      case 'pending_human': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-torqx-secondary bg-torqx-secondary/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isConnected ? 'bg-torqx-accent/10' : 'bg-red-100'
              }`}>
                <MessageCircle className={`w-6 h-6 ${
                  isConnected ? 'text-torqx-accent' : 'text-red-600'
                }`} />
              </div>
              <div>
                <CardTitle className="text-lg">WhatsApp Business</CardTitle>
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
                  <Button
                    onClick={() => setBotStatus(botStatus === 'active' ? 'paused' : 'active')}
                    variant={botStatus === 'active' ? 'secondary' : 'default'}
                    size="sm"
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
                  </Button>
                  <Button variant="outline" size="sm">
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Configurar
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsConnected(true)}
                  className="bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Conectar WhatsApp
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {isConnected && (
          <CardContent>
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
          </CardContent>
        )}
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas Hoje</CardTitle>
            <MessageCircle className="h-4 w-4 text-torqx-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-torqx-primary">{metrics.total_conversations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resolução IA</CardTitle>
            <Bot className="h-4 w-4 text-torqx-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-torqx-accent">{metrics.ai_resolution_rate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-torqx-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-torqx-primary">{metrics.appointments_scheduled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
            <div className="flex">
              {[1,2,3,4,5].map(star => (
                <div key={star} className={`w-2 h-2 rounded-full mr-1 ${
                  star <= Math.floor(metrics.customer_satisfaction) ? 'bg-yellow-400' : 'bg-gray-200'
                }`}></div>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-torqx-accent">{metrics.customer_satisfaction}/5</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Conversas Recentes</CardTitle>
            <Button variant="outline" size="sm">
              Ver Todas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
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
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-torqx-primary flex items-center gap-2">
              <MessageCircle className="w-8 h-8 text-torqx-secondary" />
              IA do WhatsApp
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie seu assistente virtual inteligente
            </p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Relatório
            </Button>
            <Button className="bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white">
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir WhatsApp
            </Button>
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
      </div>
    </DashboardLayout>
  );
};

export default WhatsAppAI;
