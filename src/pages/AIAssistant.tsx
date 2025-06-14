
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageSquare, Wrench, TrendingUp } from 'lucide-react';

const AIAssistant = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-torqx-primary flex items-center gap-2">
            <Brain className="w-8 h-8 text-torqx-secondary" />
            Assistente IA
          </h1>
          <p className="text-gray-600 mt-2">Utilize o poder da inteligência artificial para otimizar sua oficina</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-torqx-secondary" />
                Chat Inteligente
              </CardTitle>
              <CardDescription>Converse com a IA para diagnósticos e sugestões</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Descreva problemas dos veículos e receba recomendações inteligentes de serviços e peças.
              </p>
              <Button className="w-full bg-torqx-secondary hover:bg-torqx-secondary-dark">
                Iniciar Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-torqx-accent" />
                Diagnóstico Automático
              </CardTitle>
              <CardDescription>Análise inteligente de problemas veiculares</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Upload de fotos e descrições para diagnóstico automatizado com base em nossa base de conhecimento.
              </p>
              <Button variant="outline" className="w-full border-torqx-accent text-torqx-accent hover:bg-torqx-accent hover:text-white">
                Fazer Diagnóstico
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-torqx-primary" />
                Insights de Negócio
              </CardTitle>
              <CardDescription>Análises preditivas e tendências</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Receba insights sobre padrões de serviços, demanda sazonal e oportunidades de crescimento.
              </p>
              <Button variant="outline" className="w-full border-torqx-primary text-torqx-primary hover:bg-torqx-primary hover:text-white">
                Ver Insights
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="bg-gradient-to-r from-torqx-primary to-torqx-primary-light text-white">
            <CardHeader>
              <CardTitle className="text-white">🚀 Recursos Premium de IA</CardTitle>
              <CardDescription className="text-slate-300">
                Desbloqueie todo o potencial da inteligência artificial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Manutenção Preditiva</h4>
                  <p className="text-sm text-slate-300">
                    Preveja necessidades de manutenção baseado no histórico e padrões de uso dos veículos.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Otimização de Preços</h4>
                  <p className="text-sm text-slate-300">
                    IA sugere preços competitivos baseados no mercado local e demanda.
                  </p>
                </div>
              </div>
              <Button className="mt-4 bg-torqx-secondary hover:bg-torqx-secondary-dark">
                Ativar Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
