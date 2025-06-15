
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, CheckCircle, TrendingUp, Settings, Zap, Users, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-torqx-primary font-satoshi">
            Bem-vindo ao Torqx!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A força que move sua oficina. Conheça a plataforma que vai revolucionar 
            a gestão da sua oficina automotiva.
          </p>
        </div>

        {/* Video Placeholder */}
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="bg-gray-100 rounded-xl p-8 text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Rocket className="w-8 h-8 text-torqx-secondary" />
                <span className="text-lg font-medium text-gray-700">Vídeo de Apresentação</span>
              </div>
              <p className="text-gray-600 mb-4">
                Assista a uma breve apresentação sobre como o Torqx vai transformar sua oficina
              </p>
              <Button 
                variant="outline"
                onClick={() => window.open('https://www.youtube.com/watch?v=demo', '_blank')}
              >
                <Rocket className="w-4 h-4 mr-2" />
                Assistir Vídeo (3 min)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-torqx-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-torqx-secondary" />
              </div>
              <h3 className="font-semibold text-torqx-primary mb-2">IA Integrada</h3>
              <p className="text-sm text-gray-600">
                Diagnósticos automáticos, recomendações inteligentes e chatbot para atendimento 24/7
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-torqx-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-torqx-accent" />
              </div>
              <h3 className="font-semibold text-torqx-primary mb-2">Gestão Completa</h3>
              <p className="text-sm text-gray-600">
                Clientes, veículos, ordens de serviço, estoque e agendamentos em um só lugar
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-torqx-primary mb-2">Insights Poderosos</h3>
              <p className="text-sm text-gray-600">
                Relatórios em tempo real e análises preditivas para decisões inteligentes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start Actions */}
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-torqx-primary mb-6 text-center font-satoshi">
              Primeiros Passos
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                onClick={() => navigate('/customers')}
                className="bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white h-12"
              >
                <Users className="w-5 h-5 mr-2" />
                Cadastrar Primeiro Cliente
              </Button>
              
              <Button 
                onClick={() => navigate('/service-orders')}
                variant="outline"
                className="h-12"
              >
                <Settings className="w-5 h-5 mr-2" />
                Criar Primeira OS
              </Button>
              
              <Button 
                onClick={() => navigate('/inventory')}
                variant="outline"
                className="h-12"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Configurar Estoque
              </Button>
              
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="h-12"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Ver Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="max-w-2xl mx-auto bg-torqx-secondary/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-torqx-primary mb-2">
              Precisa de Ajuda?
            </h3>
            <p className="text-gray-600 mb-4">
              Nossa equipe está aqui para te ajudar a aproveitar ao máximo o Torqx
            </p>
            <div className="flex justify-center space-x-3">
              <Button 
                variant="outline"
                onClick={() => window.open('https://torqx.com.br/suporte', '_blank')}
              >
                Central de Ajuda
              </Button>
              <Button 
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                WhatsApp Suporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Welcome;
