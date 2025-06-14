
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DashboardLayout from '@/components/DashboardLayout';
import SupplierForm from '@/components/SupplierForm';
import SupplierList from '@/components/SupplierList';

const Suppliers = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSupplierSuccess = () => {
    setIsFormOpen(false);
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
            onClick={() => setIsFormOpen(true)}
            className="bg-torqx-secondary hover:bg-torqx-secondary-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Fornecedor
          </Button>
        </div>

        <SupplierList />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Fornecedor</DialogTitle>
            </DialogHeader>
            <SupplierForm onSuccess={handleSupplierSuccess} />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Suppliers;
