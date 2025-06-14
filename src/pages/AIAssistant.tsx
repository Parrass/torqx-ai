
import React, { useState, useEffect } from 'react';
import { 
  Bot, Send, Mic, MicOff, Brain, 
  Lightbulb, TrendingUp, AlertCircle,
  MessageSquare, Zap, Target, BarChart3,
  Clock, CheckCircle, RefreshCw, Settings,
  Menu, X, Users, Car, Wrench, Package, Home
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  confidence?: number;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'opportunity' | 'performance';
  priority: 'high' | 'medium' | 'low';
  action: string;
  confidence: number;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  estimated_savings: string;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: false },
    { name: 'Clientes', href: '/customers', icon: Users, current: false },
    { name: 'Veículos', href: '/vehicles', icon: Car, current: false },
    { name: 'Ordens de Serviço', href: '/service-orders', icon: Wrench, current: false },
    { name: 'Estoque', href: '/inventory', icon: Package, current: false },
    { name: 'Assistente IA', href: '/ai-assistant', icon: Bot, current: true },
    { name: 'Relatórios', href: '/reports', icon: BarChart3, current: false },
  ];

  // Mock data para demonstração
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        type: 'ai',
        content: 'Olá! Sou o assistente de IA da Torqx. Como posso ajudá-lo hoje?',
        timestamp: new Date(),
        confidence: 0.95
      }
    ];

    const mockInsights: Insight[] = [
      {
        id: '1',
        title: 'Pico de Demanda Identificado',
        description: 'Detectei um aumento de 35% em serviços de freios nas últimas 2 semanas.',
        type: 'trend',
        priority: 'high',
        action: 'Considere aumentar o estoque de pastilhas de freio',
        confidence: 0.87
      },
      {
        id: '2',
        title: 'Oportunidade de Upsell',
        description: 'Cliente Maria Silva está com manutenção em dia. Momento ideal para oferecer serviços adicionais.',
        type: 'opportunity',
        priority: 'medium',
        action: 'Sugerir troca de filtros e revisão completa',
        confidence: 0.92
      },
      {
        id: '3',
        title: 'Eficiência da Equipe',
        description: 'Carlos Santos está 20% mais rápido que a média em serviços de motor.',
        type: 'performance',
        priority: 'low',
        action: 'Considere designar mais serviços complexos para Carlos',
        confidence: 0.78
      }
    ];

    const mockRecommendations: Recommendation[] = [
      {
        id: '1',
        title: 'Otimizar Agenda de Amanhã',
        description: 'Reorganizar OS para reduzir tempo ocioso em 25%',
        impact: 'high',
        effort: 'low',
        estimated_savings: 'R$ 450'
      },
      {
        id: '2',
        title: 'Reabastecer Estoque Crítico',
        description: '3 itens com estoque abaixo do mínimo',
        impact: 'high',
        effort: 'medium',
        estimated_savings: 'Evitar paradas'
      },
      {
        id: '3',
        title: 'Campanha de Manutenção Preventiva',
        description: '12 clientes com manutenção vencendo em 30 dias',
        impact: 'medium',
        effort: 'low',
        estimated_savings: 'R$ 2.800'
      }
    ];

    setMessages(initialMessages);
    setInsights(mockInsights);
    setRecommendations(mockRecommendations);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular resposta da IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        confidence: 0.89
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (input: string): string => {
    const responses: Record<string, string> = {
      'estoque': 'Analisando seu estoque... Identifiquei que você tem 3 itens com estoque baixo: Filtro de Ar (3 unidades), Pastilha de Freio (0 unidades) e Óleo 10W40 (2 unidades). Recomendo fazer pedido urgente das pastilhas de freio.',
      'agenda': 'Sua agenda de hoje tem 5 OS programadas. Posso otimizar a sequência para reduzir o tempo de setup entre serviços. Isso pode economizar cerca de 45 minutos.',
      'cliente': 'Qual cliente você gostaria de consultar? Posso fornecer histórico completo, padrões de manutenção e sugestões de serviços.',
      'receita': 'Sua receita este mês está 18% acima do mês anterior. O serviço que mais contribuiu foi "Troca de Freios" com R$ 3.200. Identifiquei oportunidade de aumentar margem em 12% otimizando fornecedores.',
      'default': 'Entendi sua pergunta. Posso ajudar com análise de estoque, otimização de agenda, insights de clientes, relatórios de receita e muito mais. O que você gostaria de saber especificamente?'
    };

    const lowerInput = input.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }
    return responses.default;
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Aqui implementaria a funcionalidade de speech-to-text
  };

  const InsightCard = ({ insight }: { insight: Insight }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            insight.type === 'trend' ? 'bg-blue-100' :
            insight.type === 'opportunity' ? 'bg-emerald-100' :
            'bg-purple-100'
          }`}>
            {insight.type === 'trend' ? <TrendingUp className="w-5 h-5 text-blue-600" /> :
             insight.type === 'opportunity' ? <Target className="w-5 h-5 text-emerald-600" /> :
             <BarChart3 className="w-5 h-5 text-purple-600" />}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {insight.title}
            </h3>
            <p className="text-sm text-slate-600">
              Confiança: {(insight.confidence * 100).toFixed(0)}%
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          insight.priority === 'high' ? 'text-red-600 bg-red-100' :
          insight.priority === 'medium' ? 'text-yellow-600 bg-yellow-100' :
          'text-slate-600 bg-slate-100'
        }`}>
          {insight.priority === 'high' ? 'Alta' : insight.priority === 'medium' ? 'Média' : 'Baixa'}
        </span>
      </div>
      
      <p className="text-sm text-slate-700 mb-3">{insight.description}</p>
      
      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-sm font-medium text-slate-900 mb-1">Ação Recomendada:</p>
        <p className="text-sm text-slate-700">{insight.action}</p>
      </div>
    </div>
  );

  const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">
            {recommendation.title}
          </h3>
          <p className="text-sm text-slate-600 mb-3">
            {recommendation.description}
          </p>
        </div>
        <Lightbulb className="w-6 h-6 text-yellow-500" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
            recommendation.impact === 'high' ? 'bg-emerald-500' :
            recommendation.impact === 'medium' ? 'bg-yellow-500' : 'bg-slate-400'
          }`}></div>
          <p className="text-xs text-slate-500">Impacto</p>
        </div>
        <div className="text-center">
          <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
            recommendation.effort === 'low' ? 'bg-emerald-500' :
            recommendation.effort === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <p className="text-xs text-slate-500">Esforço</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-900">{recommendation.estimated_savings}</p>
          <p className="text-xs text-slate-500">Economia</p>
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-emerald-600 transition-all">
        Implementar Agora
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out rounded-r-2xl ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Torqx</span>
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
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:text-blue-500 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${
                  item.current ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
                }`} />
                {item.name}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* Overlay para sidebar mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content - Full Width */}
      <div className="w-full">
        {/* Floating Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 mr-2"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-slate-900">
                Assistente de IA
              </h1>
            </div>

            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 text-slate-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </button>
              <button className="flex items-center px-4 py-2 text-slate-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Configurar
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Assistente Torqx
                      </h3>
                      <p className="text-sm text-slate-600">Online • Pronto para ajudar</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map(message => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-xl ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white' 
                          : 'bg-gray-100 text-slate-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-white/70' : 'text-slate-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          {message.confidence && ` • ${(message.confidence * 100).toFixed(0)}% confiança`}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={toggleListening}
                      className={`p-3 rounded-xl transition-colors ${
                        isListening 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                      }`}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Digite sua pergunta ou comando..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['Analisar estoque', 'Otimizar agenda', 'Relatório de receita', 'Sugestões de upsell'].map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => setInputMessage(suggestion)}
                        className="px-3 py-1 bg-gray-100 text-slate-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Insights and Recommendations */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Status da IA
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Análises Hoje</span>
                    <span className="font-bold text-slate-900">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Insights Gerados</span>
                    <span className="font-bold text-emerald-600">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Economia Sugerida</span>
                    <span className="font-bold text-slate-900">R$ 3.250</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Precisão Média</span>
                    <span className="font-bold text-blue-600">89%</span>
                  </div>
                </div>
              </div>

              {/* Recent Insights */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">
                  Insights Recentes
                </h3>
                <div className="space-y-4">
                  {insights.slice(0, 2).map(insight => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="mt-8">
            <h3 className="font-semibold text-slate-900 mb-6">
              Recomendações Inteligentes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(recommendation => (
                <RecommendationCard key={recommendation.id} recommendation={recommendation} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIAssistant;
