
import React, { useRef, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Trash2, Download, Settings } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { useAIChat } from '@/hooks/useAIChat';

const AIAssistant = () => {
  const { messages, isLoading, sendMessage, clearChat } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleExportChat = () => {
    const chatData = messages.map(msg => 
      `[${msg.timestamp.toLocaleString('pt-BR')}] ${msg.role === 'user' ? 'Você' : 'IA'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-ia-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="p-6 h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-torqx-primary flex items-center gap-2">
              <Brain className="w-8 h-8 text-torqx-secondary" />
              Assistente IA
            </h1>
            <p className="text-gray-600 mt-1">
              Converse com a IA especializada da Torqx
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportChat}
              disabled={messages.length <= 1}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearChat}
              disabled={messages.length <= 1}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Config
            </Button>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b border-gray-200 py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-torqx-accent" />
              Chat com IA Torqx
              {isLoading && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-torqx-accent rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-torqx-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-torqx-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="ml-2">IA digitando...</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => sendMessage('Como consultar informações de um cliente?')}
              disabled={isLoading}
            >
              Consultar cliente
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => sendMessage('Como criar uma nova ordem de serviço?')}
              disabled={isLoading}
            >
              Nova OS
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => sendMessage('Mostrar relatório de vendas do mês')}
              disabled={isLoading}
            >
              Relatório mensal
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => sendMessage('Verificar estoque de peças em falta')}
              disabled={isLoading}
            >
              Estoque baixo
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
