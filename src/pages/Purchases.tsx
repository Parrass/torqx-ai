
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DashboardLayout from '@/components/DashboardLayout';
import PurchaseForm from '@/components/PurchaseForm';
import PurchaseList from '@/components/PurchaseList';
import PurchaseMetrics from '@/components/PurchaseMetrics';

const Purchases = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handlePurchaseSuccess = () => {
    setIsFormOpen(false);
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
            onClick={() => setIsFormOpen(true)}
            className="bg-torqx-secondary hover:bg-torqx-secondary-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Compra
          </Button>
        </div>

        <PurchaseMetrics />
        <PurchaseList />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Compra</DialogTitle>
            </DialogHeader>
            <PurchaseForm onSuccess={handlePurchaseSuccess} />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Purchases;
