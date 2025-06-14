
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import SupplierForm from '@/components/SupplierForm';
import SupplierList from '@/components/SupplierList';

const Suppliers = () => {
  const [activeTab, setActiveTab] = useState('list');

  const handleSupplierSuccess = () => {
    setActiveTab('list');
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-torqx-primary">Fornecedores</h1>
            <p className="text-gray-600">Gerencie seus fornecedores e parceiros comerciais</p>
          </div>
          <Button 
            onClick={() => setActiveTab('new')}
            className="bg-torqx-secondary hover:bg-torqx-secondary-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Fornecedor
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lista de Fornecedores</TabsTrigger>
            <TabsTrigger value="new">Novo Fornecedor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-6">
            <SupplierList />
          </TabsContent>
          
          <TabsContent value="new" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <SupplierForm onSuccess={handleSupplierSuccess} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Suppliers;
