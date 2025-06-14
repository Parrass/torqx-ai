
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import PurchaseForm from '@/components/PurchaseForm';
import PurchaseList from '@/components/PurchaseList';
import PurchaseMetrics from '@/components/PurchaseMetrics';

const Purchases = () => {
  const [activeTab, setActiveTab] = useState('list');

  const handlePurchaseSuccess = () => {
    setActiveTab('list');
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-torqx-primary">Compras</h1>
            <p className="text-gray-600">Gerencie suas compras e controle seus gastos</p>
          </div>
          <Button 
            onClick={() => setActiveTab('new')}
            className="bg-torqx-secondary hover:bg-torqx-secondary-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Compra
          </Button>
        </div>

        <PurchaseMetrics />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lista de Compras</TabsTrigger>
            <TabsTrigger value="new">Nova Compra</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-6">
            <PurchaseList />
          </TabsContent>
          
          <TabsContent value="new" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <PurchaseForm onSuccess={handlePurchaseSuccess} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Purchases;
