
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const useAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Olá! Sou sua assistente IA da Torqx. Posso ajudar você com:\n\n• Consultas sobre clientes e veículos\n• Análise de ordens de serviço\n• Sugestões de manutenção\n• Relatórios e estatísticas\n• Dúvidas sobre o sistema\n\nComo posso ajudar você hoje?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simular resposta da IA (depois pode ser integrado com OpenAI ou outra API)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const aiResponse = generateAIResponse(content);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        content: 'Chat limpo! Como posso ajudar você agora?',
        role: 'assistant',
        timestamp: new Date()
      }
    ]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat
  };
};

// Função temporária para simular respostas da IA
const generateAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('cliente') || lowerMessage.includes('clientes')) {
    return 'Posso ajudar você com informações sobre clientes! Você pode:\n\n• Buscar clientes por nome ou documento\n• Ver histórico de serviços\n• Adicionar novos clientes\n• Atualizar informações de contato\n\nQual operação específica você gostaria de realizar?';
  }
  
  if (lowerMessage.includes('veículo') || lowerMessage.includes('veículos') || lowerMessage.includes('carro')) {
    return 'Sobre veículos, posso te ajudar com:\n\n• Consultar informações técnicas\n• Ver histórico de manutenções\n• Cadastrar novos veículos\n• Agendar manutenções preventivas\n\nO que você precisa saber sobre os veículos?';
  }
  
  if (lowerMessage.includes('os') || lowerMessage.includes('ordem') || lowerMessage.includes('serviço')) {
    return 'Para ordens de serviço, posso:\n\n• Criar novas OS com diagnóstico automático\n• Consultar status de serviços em andamento\n• Gerar relatórios de produtividade\n• Sugerir peças e serviços\n\nQual informação sobre OS você precisa?';
  }
  
  if (lowerMessage.includes('estoque') || lowerMessage.includes('peça') || lowerMessage.includes('peças')) {
    return 'Sobre o estoque, posso:\n\n• Verificar disponibilidade de peças\n• Alertar sobre itens em falta\n• Sugerir reposição baseada no histórico\n• Analisar giro de estoque\n\nO que você gostaria de saber sobre o estoque?';
  }
  
  if (lowerMessage.includes('relatório') || lowerMessage.includes('análise') || lowerMessage.includes('estatística')) {
    return 'Posso gerar diversos relatórios e análises:\n\n• Faturamento mensal e anual\n• Produtividade dos técnicos\n• Análise de clientes mais ativos\n• Serviços mais realizados\n• Tendências de demanda\n\nQual tipo de relatório você precisa?';
  }
  
  if (lowerMessage.includes('ajuda') || lowerMessage.includes('como') || lowerMessage.includes('tutorial')) {
    return 'Posso te guiar pelo sistema Torqx! Algumas funcionalidades principais:\n\n• **Dashboard**: Visão geral da oficina\n• **Clientes**: Gerenciar base de clientes\n• **Veículos**: Cadastro e histórico\n• **OS**: Ordens de serviço inteligentes\n• **Estoque**: Controle de peças\n• **Agenda**: Agendamentos otimizados\n\nSobre qual área você gostaria de saber mais?';
  }
  
  // Resposta padrão
  return `Entendi sua pergunta sobre "${userMessage}". Como assistente IA da Torqx, posso ajudar com diversas tarefas da oficina.\n\nAlgumas sugestões do que posso fazer:\n• Consultar dados de clientes e veículos\n• Analisar ordens de serviço\n• Gerar relatórios personalizados\n• Sugerir manutenções preventivas\n• Orientar sobre o uso do sistema\n\nPoderia ser mais específico sobre o que você precisa?`;
};
