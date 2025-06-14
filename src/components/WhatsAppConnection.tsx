
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  MessageCircle, Smartphone, QrCode, CheckCircle, 
  AlertCircle, Wifi, WifiOff, Settings as SettingsIcon,
  RefreshCw, Phone, Users, BarChart3
} from 'lucide-react';

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
  isConnected, 
  setIsConnected, 
  botStatus, 
  setBotStatus,
  metrics 
}: WhatsAppConnectionProps) => {
  const [phoneNumber, setPhoneNumber] = useState('+55 11 3333-4444');
  const [showQR, setShowQR] = useState(false);

  const handleConnect = () => {
    setShowQR(true);
    // Simular processo de conexão
    setTimeout(() => {
      setIsConnected(true);
      setShowQR(false);
    }, 3000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setBotStatus('paused');
  };

  return (
    <div className="space-y-6">
      {/* Status da Conexão */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isConnected ? 'bg-torqx-accent/10' : 'bg-red-100'
              }`}>
                {isConnected ? (
                  <MessageCircle className="w-6 h-6 text-torqx-accent" />
                ) : (
                  <WifiOff className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">WhatsApp Business</CardTitle>
                <p className={`text-sm ${
                  isConnected ? 'text-torqx-accent' : 'text-red-600'
                }`}>
                  {isConnected ? `Conectado • ${phoneNumber}` : 'Desconectado'}
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
                  disabled={showQR}
                >
                  {showQR ? (
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

        {showQR && (
          <CardContent>
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <QrCode className="w-32 h-32 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Escaneie o QR Code
              </h3>
              <p className="text-gray-600">
                Abra o WhatsApp no seu celular e escaneie este código para conectar
              </p>
            </div>
          </CardContent>
        )}

        {isConnected && (
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
      {!isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Configurar Conexão</CardTitle>
            <CardDescription>
              Configure os detalhes da sua conta WhatsApp Business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Número do WhatsApp Business</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+55 11 99999-9999"
              />
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Requisitos</h4>
                  <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
                    <li>Conta WhatsApp Business verificada</li>
                    <li>Acesso ao dispositivo com WhatsApp</li>
                    <li>Conexão estável com a internet</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas de Performance */}
      {isConnected && (
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
