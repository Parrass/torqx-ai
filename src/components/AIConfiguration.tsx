
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, Save, RefreshCw, MessageSquare, Clock, 
  Settings as SettingsIcon, Zap, Target, Shield,
  Plus, Trash2, Edit, TestTube
} from 'lucide-react';

const AIConfiguration = () => {
  const [aiName, setAiName] = useState('Assistente Torqx');
  const [personality, setPersonality] = useState('Profissional e amigável, especializado em serviços automotivos');
  const [instructions, setInstructions] = useState(`Você é um assistente virtual especializado em oficinas automotivas. Suas principais funções são:

1. Atender clientes via WhatsApp
2. Agendar serviços e consultas
3. Fornecer informações sobre serviços oferecidos
4. Responder dúvidas técnicas básicas
5. Encaminhar casos complexos para técnicos humanos

Sempre seja educado, objetivo e busque resolver os problemas dos clientes de forma eficiente.`);
  
  const [autoResponse, setAutoResponse] = useState(true);
  const [responseTime, setResponseTime] = useState(5);
  const [businessHours, setBusinessHours] = useState(true);
  const [transferToHuman, setTransferToHuman] = useState(true);
  
  const [quickResponses, setQuickResponses] = useState([
    { id: 1, trigger: 'horário', response: 'Nosso horário de funcionamento é de segunda a sexta, das 8h às 18h, e sábados das 8h às 12h.' },
    { id: 2, trigger: 'preço', response: 'Para um orçamento personalizado, preciso de algumas informações sobre seu veículo. Qual o modelo, ano e qual serviço você precisa?' },
    { id: 3, trigger: 'agendamento', response: 'Posso te ajudar a agendar um horário! Qual serviço você precisa e qual sua preferência de data?' }
  ]);

  const [isTraining, setIsTraining] = useState(false);

  const handleSave = () => {
    setIsTraining(true);
    // Simular treinamento da IA
    setTimeout(() => {
      setIsTraining(false);
      // Aqui seria feita a integração com a API de treinamento
    }, 3000);
  };

  const addQuickResponse = () => {
    const newId = Math.max(...quickResponses.map(r => r.id)) + 1;
    setQuickResponses([...quickResponses, { id: newId, trigger: '', response: '' }]);
  };

  const removeQuickResponse = (id: number) => {
    setQuickResponses(quickResponses.filter(r => r.id !== id));
  };

  const updateQuickResponse = (id: number, field: 'trigger' | 'response', value: string) => {
    setQuickResponses(quickResponses.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  return (
    <div className="space-y-6">
      {/* Configurações Básicas da IA */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-torqx-accent" />
            <CardTitle>Personalidade da IA</CardTitle>
          </div>
          <CardDescription>
            Configure como sua IA vai se comportar e responder aos clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ai-name">Nome do Assistente</Label>
            <Input
              id="ai-name"
              value={aiName}
              onChange={(e) => setAiName(e.target.value)}
              placeholder="Ex: Maria, João, Assistente Torqx"
            />
          </div>
          
          <div>
            <Label htmlFor="personality">Personalidade</Label>
            <Input
              id="personality"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="Ex: Amigável e profissional"
            />
          </div>
          
          <div>
            <Label htmlFor="instructions">Instruções Detalhadas</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={8}
              placeholder="Descreva como a IA deve se comportar, que tipos de perguntas deve responder, etc."
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Comportamento */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5 text-torqx-secondary" />
            <CardTitle>Comportamento</CardTitle>
          </div>
          <CardDescription>
            Configure quando e como a IA deve responder
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Resposta Automática</h4>
              <p className="text-sm text-gray-600">IA responde automaticamente às mensagens</p>
            </div>
            <Switch
              checked={autoResponse}
              onCheckedChange={setAutoResponse}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Respeitar Horário Comercial</h4>
              <p className="text-sm text-gray-600">IA só responde durante horário de funcionamento</p>
            </div>
            <Switch
              checked={businessHours}
              onCheckedChange={setBusinessHours}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Transferir para Humano</h4>
              <p className="text-sm text-gray-600">Permitir transferência quando necessário</p>
            </div>
            <Switch
              checked={transferToHuman}
              onCheckedChange={setTransferToHuman}
            />
          </div>
          
          <div>
            <Label htmlFor="response-time">Tempo de Resposta (segundos)</Label>
            <Input
              id="response-time"
              type="number"
              value={responseTime}
              onChange={(e) => setResponseTime(Number(e.target.value))}
              min={1}
              max={30}
            />
            <p className="text-sm text-gray-600 mt-1">
              Simula tempo de digitação humana
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Respostas Rápidas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-torqx-accent" />
              <CardTitle>Respostas Rápidas</CardTitle>
            </div>
            <Button onClick={addQuickResponse} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
          <CardDescription>
            Configure respostas automáticas para palavras-chave comuns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {quickResponses.map((response) => (
            <div key={response.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Resposta Rápida #{response.id}</h4>
                <Button
                  onClick={() => removeQuickResponse(response.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Palavra-chave</Label>
                  <Input
                    value={response.trigger}
                    onChange={(e) => updateQuickResponse(response.id, 'trigger', e.target.value)}
                    placeholder="Ex: horário, preço, agendamento"
                  />
                </div>
                <div>
                  <Label>Resposta</Label>
                  <Textarea
                    value={response.response}
                    onChange={(e) => updateQuickResponse(response.id, 'response', e.target.value)}
                    rows={3}
                    placeholder="Resposta que será enviada automaticamente"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-between items-center">
        <Button variant="outline">
          <TestTube className="w-4 h-4 mr-2" />
          Testar IA
        </Button>
        
        <div className="space-x-3">
          <Button variant="secondary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isTraining}
            className="bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white"
          >
            {isTraining ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Treinando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar e Treinar
              </>
            )}
          </Button>
        </div>
      </div>

      {isTraining && (
        <Card className="border-torqx-accent">
          <CardContent className="pt-6">
            <div className="text-center">
              <Brain className="w-12 h-12 text-torqx-accent mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-medium text-torqx-primary mb-2">
                Treinando IA...
              </h3>
              <p className="text-gray-600">
                A IA está sendo atualizada com as novas configurações. Isso pode levar alguns minutos.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIConfiguration;
