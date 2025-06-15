
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, Download, ExternalLink, Brain, Smartphone, Settings
} from 'lucide-react';
import WhatsAppConnection from '@/components/WhatsAppConnection';
import WhatsAppInstanceSettings from '@/components/WhatsAppInstanceSettings';
import AIConfiguration from '@/components/AIConfiguration';

interface Metrics {
  total_conversations: number;
  ai_resolution_rate: number;
  avg_response_time: number;
  appointments_scheduled: number;
  customer_satisfaction: number;
  active_conversations: number;
}

const WhatsAppAI = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [instanceName, setInstanceName] = useState<string>('');
  const [botStatus, setBotStatus] = useState('active');
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [metrics, setMetrics] = useState<Metrics>({
    total_conversations: 156,
    ai_resolution_rate: 78,
    avg_response_time: 12,
    appointments_scheduled: 34,
    customer_satisfaction: 4.6,
    active_conversations: 8
  });

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
              Configure e gerencie seu assistente virtual inteligente
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

        {/* Tabs para WhatsApp, Configurações e IA */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger 
              value="whatsapp" 
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-torqx-primary"
            >
              <Smartphone className="w-4 h-4" />
              <span>Conexão</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-torqx-primary"
            >
              <Settings className="w-4 h-4" />
              <span>Configurações</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-config" 
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-torqx-primary"
            >
              <Brain className="w-4 h-4" />
              <span>IA</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp" className="space-y-6">
            <WhatsAppConnection
              isConnected={isConnected}
              setIsConnected={(connected) => {
                setIsConnected(connected);
                // Capturar instanceName quando a conexão for atualizada
                // Isso seria idealmente passado pelo componente WhatsAppConnection
              }}
              botStatus={botStatus}
              setBotStatus={setBotStatus}
              metrics={metrics}
              onInstanceChange={(name) => setInstanceName(name)}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <WhatsAppInstanceSettings
              instanceName={instanceName}
              isConnected={isConnected}
            />
          </TabsContent>

          <TabsContent value="ai-config" className="space-y-6">
            <AIConfiguration />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default WhatsAppAI;
