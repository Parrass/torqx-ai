
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';

const Vehicles = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-torqx-primary">Veículos</h1>
            <p className="text-gray-600 mt-2">Gerencie os veículos dos seus clientes</p>
          </div>
          <Button className="bg-torqx-secondary hover:bg-torqx-secondary-dark">
            <Plus className="w-4 h-4 mr-2" />
            Novo Veículo
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-torqx-secondary" />
                Honda Civic 2020
              </CardTitle>
              <CardDescription>João Silva - ABC-1234</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quilometragem:</span>
                  <span className="font-medium">45.000 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Combustível:</span>
                  <span className="font-medium">Flex</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Último serviço:</span>
                  <span className="font-medium">15/12/2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-torqx-secondary" />
                Toyota Corolla 2019
              </CardTitle>
              <CardDescription>Maria Santos - XYZ-5678</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quilometragem:</span>
                  <span className="font-medium">32.500 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Combustível:</span>
                  <span className="font-medium">Flex</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Último serviço:</span>
                  <span className="font-medium">08/01/2025</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-torqx-secondary" />
                Ford Ka 2018
              </CardTitle>
              <CardDescription>Pedro Costa - DEF-9101</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quilometragem:</span>
                  <span className="font-medium">68.200 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Combustível:</span>
                  <span className="font-medium">Flex</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Último serviço:</span>
                  <span className="font-medium">22/11/2024</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Vehicles;
