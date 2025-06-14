
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus, Users } from 'lucide-react';

const Appointments = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-torqx-primary flex items-center gap-2">
              <Calendar className="w-8 h-8 text-torqx-secondary" />
              Agenda
            </h1>
            <p className="text-gray-600 mt-2">Gerencie os agendamentos da sua oficina</p>
          </div>
          <Button className="bg-torqx-secondary hover:bg-torqx-secondary-dark">
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-torqx-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-torqx-primary">8</div>
              <p className="text-xs text-gray-500">agendamentos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
              <Clock className="h-4 w-4 text-torqx-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-torqx-primary">24</div>
              <p className="text-xs text-gray-500">agendamentos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-torqx-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-torqx-primary">156</div>
              <p className="text-xs text-gray-500">este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
              <div className="h-4 w-4 bg-torqx-accent rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-torqx-primary">87%</div>
              <p className="text-xs text-gray-500">capacidade</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agendamentos de Hoje</CardTitle>
            <CardDescription>
              Visualize e gerencie os agendamentos do dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Calendário em Desenvolvimento</h3>
              <p className="text-gray-500 mb-4">
                O sistema de agendamentos está sendo desenvolvido
              </p>
              <Button variant="outline">
                Configurar Agenda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
