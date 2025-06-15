
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, QrCode, CheckCircle, 
  AlertCircle, Wifi, WifiOff, RefreshCw, Copy
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
  const { connection, isLoading, createInstance, generateQRCode, checkStatus, disconnect, loadExistingInstance } = useWhatsApp();
  const [showQRCode, setShowQRCode] = useState(false);
  const { toast } = useToast();

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

  const copyQRCode = () => {
    if (connection.qrCode) {
      navigator.clipboard.writeText(connection.qrCode);
      toast({
        title: 'QR Code copiado',
        description: 'QR Code copiado para a área de transferência',
      });
    }
  };

  const copyPairingCode = () => {
    if (connection.pairingCode) {
      navigator.clipboard.writeText(connection.pairingCode);
      toast({
        title: 'Código de pareamento copiado',
        description: 'Código copiado para a área de transferência',
      });
    }
  };

  // Determinar se tem instância criada
  const hasInstance = !!connection.instance || !!connection.instanceName;

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

        {/* QR Code Display */}
        {showQRCode && (connection.qrCode || connection.pairingCode) && !connection.isConnected && (
          <CardContent>
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              {connection.qrCode && (
                <div className="relative mb-6">
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
              )}

              {connection.pairingCode && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Código de Pareamento
                  </h4>
                  <div className="flex items-center justify-center space-x-2">
                    <code className="bg-white px-4 py-2 rounded border text-lg font-mono">
                      {connection.pairingCode}
                    </code>
                    <Button
                      onClick={copyPairingCode}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Conecte seu WhatsApp
              </h3>
              <p className="text-gray-600 mb-4">
                Escaneie o QR Code ou use o código de pareamento no WhatsApp
              </p>
              <Button onClick={handleGenerateQRCode} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </CardContent>
        )}

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
