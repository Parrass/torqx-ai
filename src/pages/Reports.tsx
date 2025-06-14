
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, TrendingUp, DollarSign, Users, Wrench } from 'lucide-react';

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-torqx-primary flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-torqx-secondary" />
              Relatórios
            </h1>
            <p className="text-gray-600 mt-2">Análises e insights do seu negócio</p>
          </div>
          <Button className="bg-torqx-secondary hover:bg-torqx-secondary-dark">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-torqx-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-torqx-primary">R$ 45.231</div>
              <p className="text-xs text-torqx-accent">+20.1% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-torqx-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-torqx-primary">+2.350</div>
              <p className="text-xs text-torqx-accent">+180 novos este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Serviços Realizados</CardTitle>
              <Wrench className="h-4 w-4 text-torqx-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-torqx-primary">12.234</div>
              <p className="text-xs text-torqx-accent">+19% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
              <TrendingUp className="h-4 w-4 text-torqx-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-torqx-primary">+5.7%</div>
              <p className="text-xs text-torqx-accent">+2.5% em relação ao trimestre anterior</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Financeiros</CardTitle>
              <CardDescription>
                Análises de receita, despesas e lucratividade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Relatório de Faturamento
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Análise de Lucratividade
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Fluxo de Caixa
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Relatórios Operacionais</CardTitle>
              <CardDescription>
                Análises de produtividade e performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Wrench className="w-4 h-4 mr-2" />
                  Produtividade dos Técnicos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Satisfação do Cliente
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Tempo Médio de Serviço
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Dashboard Personalizado</CardTitle>
            <CardDescription>
              Crie relatórios customizados com os dados que você precisa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Relatórios Avançados</h3>
              <p className="text-gray-500 mb-4">
                Sistema de relatórios customizáveis em desenvolvimento
              </p>
              <Button variant="outline">
                Solicitar Acesso Beta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
