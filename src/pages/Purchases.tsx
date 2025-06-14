
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PurchaseForm } from '@/components/PurchaseForm';
import { PurchasesList } from '@/components/PurchasesList';
import { PurchaseMetrics } from '@/components/PurchaseMetrics';
import { usePurchases } from '@/hooks/usePurchases';

const Purchases = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const { data: purchases = [], isLoading } = usePurchases();

  const handleCreatePurchase = () => {
    setSelectedPurchase(null);
    setIsFormOpen(true);
  };

  const handleEditPurchase = (purchase: any) => {
    setSelectedPurchase(purchase);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedPurchase(null);
  };

  // Calculate quick metrics
  const totalPurchases = purchases.length;
  const pendingAmount = purchases
    .filter(p => p.payment_status === 'pending')
    .reduce((sum, p) => sum + parseFloat(String(p.final_amount || 0)), 0);
  const monthlyTotal = purchases
    .filter(p => {
      const purchaseDate = new Date(p.purchase_date);
      const currentMonth = new Date();
      return purchaseDate.getMonth() === currentMonth.getMonth() && 
             purchaseDate.getFullYear() === currentMonth.getFullYear();
    })
    .reduce((sum, p) => sum + parseFloat(String(p.final_amount || 0)), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-torqx-primary font-satoshi">Compras</h1>
            <p className="text-gray-600 font-inter">Gerencie todas as compras e controle de gastos</p>
          </div>
          <Button onClick={handleCreatePurchase} className="bg-torqx-secondary hover:bg-torqx-secondary-dark">
            <Plus className="w-4 h-4 mr-2" />
            Nova Compra
          </Button>
        </div>

        {/* Quick Metrics Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-inter">Total de Compras</p>
                  <p className="text-2xl font-bold text-torqx-primary font-satoshi">{totalPurchases}</p>
                </div>
                <div className="w-12 h-12 bg-torqx-secondary/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-torqx-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-inter">Pendente</p>
                  <p className="text-2xl font-bold text-orange-600 font-satoshi">
                    R$ {pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-inter">Total do Mês</p>
                  <p className="text-2xl font-bold text-torqx-accent font-satoshi">
                    R$ {monthlyTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-torqx-accent/10 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-torqx-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="purchases" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchases">Compras</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>

          <TabsContent value="purchases" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar por fornecedor, número da compra..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Purchases List */}
            <PurchasesList
              purchases={purchases}
              searchTerm={searchTerm}
              isLoading={isLoading}
              onEdit={handleEditPurchase}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <PurchaseMetrics />
          </TabsContent>
        </Tabs>

        {/* Purchase Form Modal */}
        <PurchaseForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          purchase={selectedPurchase}
        />
      </div>
    </DashboardLayout>
  );
};

export default Purchases;
