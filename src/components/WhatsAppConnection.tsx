import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, QrCode, CheckCircle, 
  AlertCircle, Wifi, WifiOff, RefreshCw
} from 'lucide-react';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import QRCodeDisplay from './QRCodeDisplay';

interface WhatsAppConnectionProps {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  botStatus: string;
  setBotStatus: (status: string) => void;
  onInstanceChange?: (instanceName: string) => void;
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
  onInstanceChange,
  metrics 
}: WhatsAppConnectionProps) => {
  const { connection, isLoading, createInstance, generateQRCode, checkStatus, fetchInstanceData, disconnect, loadExistingInstance } = useWhatsApp();
  const [showQRCode, setShowQRCode] = useState(false);

  // Carregar instância existente ao montar o componente
  useEffect(() => {
    loadExistingInstance();
  }, [loadExistingInstance]);

  // Sincronizar estado local com hook
  useEffect(() => {
    propSetIsConnected(connection.isConnected);
  }, [connection.isConnected, propSetIsConnected]);

  // Verificar status periodicamente se conectado
  useEffect(() => {
    if (connection.isConnected) {
      const interval = setInterval(checkStatus, 10000); // A cada 10s
      return () => clearInterval(interval);
    }
  }, [connection.isConnected, checkStatus]);

  // Notificar mudanças no instanceName
  useEffect(() => {
    if (connection.instanceName && onInstanceChange) {
      onInstanceChange(connection.instanceName);
    }
  }, [connection.instanceName, onInstanceChange]);

  const handleCreateInstance = async () => {
    try {
      await createInstance();
      setShowQRCode(false); // Reset QR code display
    } catch (error) {
      console.error('Erro ao criar instância:', error);
    }
  };

  const handleGenerateQRCode = async () => {
    try {
      await generateQRCode();
      setShowQRCode(true);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setBotStatus('paused');
    setShowQRCode(false);
  };

  const handleRefreshStatus = async () => {
    try {
      await fetchInstanceData();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  // Determinar se tem instância criada
  const hasInstance = !!connection.instance || !!connection.instanceName;
  const hasQRCodeData = !!(connection.qrCode || connection.pairingCode);

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
                  {connection.isConnected ? 'Conectado' : hasInstance ? 'Instância criada' : 'Desconectado'}
                  {connection.status && ` • ${connection.status}`}
                </p>
                {connection.instanceName && (
                  <p className="text-xs text-gray-500">Instância: {connection.instanceName}</p>
                )}
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
                  <Button variant="outline" size="sm" onClick={handleRefreshStatus}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDisconnect}>
                    Desconectar
                  </Button>
                </>
              ) : hasInstance ? (
                <div className="space-x-2">
                  <Button
                    onClick={handleGenerateQRCode}
                    className="bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4 mr-2" />
                        Gerar QR Code
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRefreshStatus}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDisconnect}>
                    Remover Instância
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleCreateInstance}
                  className="bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Criando...
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

        {/* Status Info when Connected */}
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

      {/* QR Code Display */}
      {(showQRCode || hasQRCodeData) && !connection.isConnected && hasInstance && (
        <QRCodeDisplay
          qrCode={connection.qrCode}
          pairingCode={connection.pairingCode}
          onRefresh={handleGenerateQRCode}
          isLoading={isLoading}
        />
      )}

      {/* Instruções quando não há instância */}
      {!hasInstance && (
        <Card>
          <CardHeader>
            <CardTitle>Como Conectar</CardTitle>
            <CardDescription>
              Siga os passos para conectar sua oficina ao WhatsApp Business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Requisitos</h4>
                  <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
                    <li>Conta WhatsApp Business ativa</li>
                    <li>Acesso ao dispositivo com WhatsApp</li>
                    <li>Número de telefone válido</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WhatsAppConnection;
