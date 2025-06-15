
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  MessageCircle, Smartphone, QrCode, CheckCircle, 
  AlertCircle, Wifi, WifiOff, Settings as SettingsIcon,
  RefreshCw, Phone, Users, BarChart3, Copy
} from 'lucide-react';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppConnectionProps {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  botStatus: string;
  setBotStatus: (status: string) => void;
  metrics: {
    total_conversations: number;
    active_conversations: number;
    avg_response_time: number;
    appointments_scheduled: number;
  };
}

const WhatsAppConnection = ({ 
  isConnected: propIsConnected, 
  setIsConnected: propSetIsConnected, 
  botStatus, 
  setBotStatus,
  metrics 
}: WhatsAppConnectionProps) => {
  const { connection, isLoading, createInstance, getQRCode, checkStatus, disconnect } = useWhatsApp();
  const [instanceName, setInstanceName] = useState('torqx-instance');
  const { toast } = useToast();

  // Sincronizar estado local com hook
  useEffect(() => {
    propSetIsConnected(connection.isConnected);
  }, [connection.isConnected, propSetIsConnected]);

  // Verificar status periodicamente
  useEffect(() => {
    if (connection.isConnected) {
      const interval = setInterval(checkStatus, 10000); // A cada 10s
      return () => clearInterval(interval);
    }
  }, [connection.isConnected, checkStatus]);

  const handleConnect = async () => {
    await createInstance();
  };

  const handleDisconnect = async () => {
    await disconnect();
    setBotStatus('paused');
  };

  const handleRefreshQR = async () => {
    await getQRCode();
  };

  const copyQRCode = () => {
    if (connection.qrCode) {
      navigator.clipboard.writeText(connection.qrCode);
      toast({
        title: 'QR Code copiado',
        description: 'QR Code copiado para a área de transferência',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Status da Conexão */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                connection.isConnected ? 'bg-torqx-accent/10' : 'bg-red-100'
              }`}>
                {connection.isConnected ? (
                  <MessageCircle className="w-6 h-6 text-torqx-accent" />
                ) : (
                  <WifiOff className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">WhatsApp Business</CardTitle>
                <p className={`text-sm ${
                  connection.isConnected ? 'text-torqx-accent' : 'text-red-600'
                }`}>
                  {connection.isConnected ? 'Conectado' : 'Desconectado'}
                  {connection.status && ` • ${connection.status}`}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {connection.isConnected ? (
                <>
                  <Button
                    onClick={() => setBotStatus(botStatus === 'active' ? 'paused' : 'active')}
                    variant={botStatus === 'active' ? 'secondary' : 'default'}
                    size="sm"
                  >
                    {botStatus === 'active' ? (
                      <>
                        <WifiOff className="w-4 h-4 mr-2" />
                        Pausar IA
                      </>
                    ) : (
                      <>
                        <Wifi className="w-4 h-4 mr-2" />
                        Ativar IA
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDisconnect}>
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Desconectar
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleConnect}
                  className="bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Conectar WhatsApp
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {connection.qrCode && !connection.isConnected && (
          <CardContent>
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <div className="relative">
                {connection.qrCode.startsWith('data:') ? (
                  <img 
                    src={connection.qrCode} 
                    alt="QR Code WhatsApp" 
                    className="w-64 h-64 mx-auto border-2 border-gray-200 rounded-lg"
                  />
                ) : (
                  <div className="w-64 h-64 mx-auto border-2 border-gray-200 rounded-lg flex items-center justify-center bg-white">
                    <QrCode className="w-32 h-32 text-gray-400" />
                  </div>
                )}
                <Button
                  onClick={copyQRCode}
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">
                Escaneie o QR Code
              </h3>
              <p className="text-gray-600 mb-4">
                Abra o WhatsApp no seu celular e escaneie este código para conectar
              </p>
              <Button onClick={handleRefreshQR} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar QR Code
              </Button>
            </div>
          </CardContent>
        )}

        {connection.isConnected && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-torqx-primary">{metrics.appointments_scheduled}</p>
                <p className="text-sm text-gray-600">Agendamentos</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Configurações de Conexão */}
      {!connection.isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Configurar Conexão</CardTitle>
            <CardDescription>
              Configure sua instância WhatsApp Business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="instanceName">Nome da Instância</Label>
              <Input
                id="instanceName"
                value={instanceName}
                onChange={(e) => setInstanceName(e.target.value)}
                placeholder="torqx-instance"
              />
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Requisitos</h4>
                  <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
                    <li>Conta WhatsApp Business ativa</li>
                    <li>Acesso ao dispositivo com WhatsApp</li>
                    <li>Evolution API configurada</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas de Performance */}
      {propIsConnected && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversas Hoje</CardTitle>
              <MessageCircle className="h-4 w-4 text-torqx-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-torqx-primary">{metrics.total_conversations}</div>
              <p className="text-xs text-gray-600 mt-1">+12% vs ontem</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa Resposta IA</CardTitle>
              <BarChart3 className="h-4 w-4 text-torqx-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-torqx-accent">78%</div>
              <p className="text-xs text-gray-600 mt-1">Resolvidas sem humano</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
              <Phone className="h-4 w-4 text-torqx-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-torqx-primary">{metrics.appointments_scheduled}</div>
              <p className="text-xs text-gray-600 mt-1">Via WhatsApp IA</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
              <Users className="h-4 w-4 text-torqx-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-torqx-accent">4.6/5</div>
              <p className="text-xs text-gray-600 mt-1">Avaliação média</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WhatsAppConnection;
