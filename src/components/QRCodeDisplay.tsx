
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeDisplayProps {
  qrCode?: string;
  pairingCode?: string;
  onRefresh: () => void;
  isLoading: boolean;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrCode,
  pairingCode,
  onRefresh,
  isLoading
}) => {
  const { toast } = useToast();

  const copyQRCode = () => {
    if (qrCode) {
      navigator.clipboard.writeText(qrCode);
      toast({
        title: 'QR Code copiado',
        description: 'QR Code copiado para a área de transferência',
      });
    }
  };

  const copyPairingCode = () => {
    if (pairingCode) {
      navigator.clipboard.writeText(pairingCode);
      toast({
        title: 'Código de pareamento copiado',
        description: 'Código copiado para a área de transferência',
      });
    }
  };

  // Função para gerar o QR Code visual a partir do código
  const generateQRCodeImage = (code: string) => {
    // Se já é uma imagem base64, retorna diretamente
    if (code.startsWith('data:image/')) {
      return code;
    }
    
    // Gera QR Code usando uma biblioteca online (fallback simples)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(code)}`;
    return qrCodeUrl;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          {qrCode && (
            <div className="relative mb-6">
              <img 
                src={generateQRCodeImage(qrCode)}
                alt="QR Code WhatsApp" 
                className="w-64 h-64 mx-auto border-2 border-gray-200 rounded-lg"
                onError={(e) => {
                  // Fallback se a imagem não carregar
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div 
                className="w-64 h-64 mx-auto border-2 border-gray-200 rounded-lg items-center justify-center bg-gray-50" 
                style={{ display: 'none' }}
              >
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600">QR Code gerado</p>
                  <Button
                    onClick={copyQRCode}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Código
                  </Button>
                </div>
              </div>
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

          {pairingCode && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Código de Pareamento
              </h4>
              <div className="flex items-center justify-center space-x-2">
                <code className="bg-white px-4 py-2 rounded border text-lg font-mono border-torqx-secondary">
                  {pairingCode}
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
            {qrCode ? 'Escaneie o QR Code' : ''}
            {qrCode && pairingCode ? ' ou ' : ''}
            {pairingCode ? 'use o código de pareamento' : ''} no WhatsApp
          </p>
          
          <div className="flex justify-center space-x-3">
            <Button 
              onClick={onRefresh} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Atualizar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
