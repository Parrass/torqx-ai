
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, Save, RefreshCw, Globe, Phone, 
  MessageSquare, Eye, EyeOff, Archive
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { whatsappApi, type WhatsAppSettings } from '@/services/whatsappApi';

interface WhatsAppInstanceSettingsProps {
  instanceName: string;
  isConnected: boolean;
}

const WhatsAppInstanceSettings = ({ instanceName, isConnected }: WhatsAppInstanceSettingsProps) => {
  const [settings, setSettings] = useState<WhatsAppSettings>({
    rejectCall: true,
    msgCall: 'Chamadas não são aceitas. Entre em contato via mensagem.',
    groupsIgnore: true,
    alwaysOnline: true,
    readMessages: true,
    readStatus: true,
    syncFullHistory: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const { toast } = useToast();

  // Carregar configurações atuais
  const loadSettings = async () => {
    if (!instanceName) return;

    setIsLoadingSettings(true);
    try {
      const response = await whatsappApi.getInstanceSettings(instanceName);
      
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: 'Erro ao carregar configurações',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingSettings(false);
    }
  };

  // Salvar configurações
  const saveSettings = async () => {
    if (!instanceName) return;

    setIsLoading(true);
    try {
      const response = await whatsappApi.setInstanceSettings(instanceName, settings);
      
      if (response.success) {
        toast({
          title: 'Configurações salvas',
          description: 'Configurações da instância atualizadas com sucesso.',
        });
      } else {
        throw new Error(response.error || 'Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: 'Erro ao salvar configurações',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (instanceName && isConnected) {
      loadSettings();
    }
  }, [instanceName, isConnected]);

  if (!instanceName) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Configurações da Instância</span>
          </CardTitle>
          <CardDescription>
            Nenhuma instância selecionada
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Configurações da Instância</span>
            </CardTitle>
            <CardDescription>
              Configure o comportamento da instância {instanceName}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadSettings}
              disabled={isLoadingSettings || !isConnected}
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingSettings ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              onClick={saveSettings}
              disabled={isLoading || !isConnected}
              className="bg-torqx-secondary text-white"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Chamadas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-red-500" />
              <div>
                <Label className="text-base font-medium">Rejeitar Chamadas</Label>
                <p className="text-sm text-gray-600">Rejeitar automaticamente chamadas de voz/vídeo</p>
              </div>
            </div>
            <Switch
              checked={settings.rejectCall}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, rejectCall: checked }))
              }
              disabled={!isConnected}
            />
          </div>

          {settings.rejectCall && (
            <div className="space-y-2">
              <Label htmlFor="msgCall">Mensagem de Rejeição</Label>
              <Textarea
                id="msgCall"
                value={settings.msgCall}
                onChange={(e) => 
                  setSettings(prev => ({ ...prev, msgCall: e.target.value }))
                }
                placeholder="Mensagem enviada quando uma chamada for rejeitada"
                disabled={!isConnected}
              />
            </div>
          )}
        </div>

        {/* Grupos */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <div>
              <Label className="text-base font-medium">Ignorar Grupos</Label>
              <p className="text-sm text-gray-600">Não processar mensagens de grupos</p>
            </div>
          </div>
          <Switch
            checked={settings.groupsIgnore}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, groupsIgnore: checked }))
            }
            disabled={!isConnected}
          />
        </div>

        {/* Status Online */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-green-500" />
            <div>
              <Label className="text-base font-medium">Sempre Online</Label>
              <p className="text-sm text-gray-600">Manter status sempre como online</p>
            </div>
          </div>
          <Switch
            checked={settings.alwaysOnline}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, alwaysOnline: checked }))
            }
            disabled={!isConnected}
          />
        </div>

        {/* Leitura de Mensagens */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-purple-500" />
            <div>
              <Label className="text-base font-medium">Marcar como Lida</Label>
              <p className="text-sm text-gray-600">Marcar mensagens automaticamente como lidas</p>
            </div>
          </div>
          <Switch
            checked={settings.readMessages}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, readMessages: checked }))
            }
            disabled={!isConnected}
          />
        </div>

        {/* Status de Leitura */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <EyeOff className="w-5 h-5 text-orange-500" />
            <div>
              <Label className="text-base font-medium">Confirmar Leitura</Label>
              <p className="text-sm text-gray-600">Enviar confirmação de leitura (tick azul)</p>
            </div>
          </div>
          <Switch
            checked={settings.readStatus}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, readStatus: checked }))
            }
            disabled={!isConnected}
          />
        </div>

        {/* Sincronização Completa */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Archive className="w-5 h-5 text-yellow-500" />
            <div>
              <Label className="text-base font-medium">Sincronizar Histórico</Label>
              <p className="text-sm text-gray-600">Sincronizar todo o histórico de mensagens</p>
            </div>
          </div>
          <Switch
            checked={settings.syncFullHistory}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, syncFullHistory: checked }))
            }
            disabled={!isConnected}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppInstanceSettings;
