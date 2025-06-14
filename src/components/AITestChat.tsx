
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, User, Send, X } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface AITestChatProps {
  isOpen: boolean;
  onClose: () => void;
  aiName: string;
  personality: string;
}

const AITestChat = ({ isOpen, onClose, aiName, personality }: AITestChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Olá! Sou o ${aiName}. ${personality}\n\nComo posso ajudar você hoje?`,
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simular resposta da IA baseada nas configurações
    setTimeout(() => {
      const aiResponse = generateTestResponse(inputMessage, aiName);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-torqx-accent rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg">{aiName}</DialogTitle>
                <p className="text-sm text-gray-600">Teste da IA</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-torqx-secondary text-white' 
                  : 'bg-torqx-accent text-white'
              }`}>
                {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={`max-w-[75%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-2xl ${
                  message.role === 'user' 
                    ? 'bg-torqx-secondary text-white rounded-br-md' 
                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
                <p className={`text-xs text-gray-500 mt-1 px-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-torqx-accent rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-md p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="border-t p-4">
          <div className="flex gap-3 items-end">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 min-h-[50px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-torqx-secondary hover:bg-torqx-secondary-dark h-[50px] px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Função para gerar respostas de teste baseadas nas configurações
const generateTestResponse = (userMessage: string, aiName: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('horário') || lowerMessage.includes('funcionamento')) {
    return 'Nosso horário de funcionamento é de segunda a sexta, das 8h às 18h, e sábados das 8h às 12h. Posso agendar um horário para você!';
  }
  
  if (lowerMessage.includes('preço') || lowerMessage.includes('orçamento') || lowerMessage.includes('custo')) {
    return 'Para um orçamento personalizado, preciso de algumas informações sobre seu veículo. Qual o modelo, ano e qual serviço você precisa?';
  }
  
  if (lowerMessage.includes('agend') || lowerMessage.includes('marca')) {
    return 'Posso te ajudar a agendar um horário! Qual serviço você precisa e qual sua preferência de data? Temos horários disponíveis para esta semana.';
  }
  
  if (lowerMessage.includes('serviço') || lowerMessage.includes('manutenção')) {
    return 'Oferecemos diversos serviços automotivos como:\n\n• Troca de óleo e filtros\n• Revisão preventiva\n• Freios e suspensão\n• Ar condicionado\n• Diagnóstico eletrônico\n\nQual serviço você está procurando?';
  }
  
  if (lowerMessage.includes('localização') || lowerMessage.includes('endereço') || lowerMessage.includes('onde')) {
    return 'Nossa oficina está localizada na [Endereço da Oficina]. Temos estacionamento disponível e fácil acesso. Quer que eu envie o link da localização?';
  }
  
  if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde')) {
    return `Olá! Sou o ${aiName} da nossa oficina. É um prazer falar com você! Como posso ajudar com seu veículo hoje?`;
  }
  
  // Resposta padrão
  return `Entendi sua pergunta sobre "${userMessage}". Como assistente da oficina, posso ajudar com agendamentos, informações sobre serviços, orçamentos e dúvidas gerais.\n\nPoderia ser mais específico sobre o que você precisa? Estou aqui para ajudar!`;
};

export default AITestChat;
