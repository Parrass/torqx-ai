
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Purchase } from '@/types/purchase';
import { usePurchases } from '@/hooks/usePurchases';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PurchaseList = () => {
  const { purchases, updateStatus } = usePurchases();
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: 'Pendente' },
      paid: { variant: 'default' as const, label: 'Pago' },
      overdue: { variant: 'destructive' as const, label: 'Vencido' },
      cancelled: { variant: 'outline' as const, label: 'Cancelado' }
    };

    const config = variants[status as keyof typeof variants] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      general: 'Geral',
      parts: 'Peças',
      tools: 'Ferramentas',
      equipment: 'Equipamentos',
      office: 'Escritório',
      maintenance: 'Manutenção'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const paymentDate = status === 'paid' ? new Date().toISOString().split('T')[0] : undefined;
      await updateStatus.mutateAsync({ id, status, paymentDate });
      toast({ 
        title: "Sucesso", 
        description: `Status da compra atualizado para ${status === 'paid' ? 'Pago' : 'Cancelado'}!` 
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({ 
        title: "Erro", 
        description: "Erro ao atualizar status da compra", 
        variant: "destructive" 
      });
    }
  };

  if (purchases.isLoading) {
    return <div className="text-center py-8">Carregando compras...</div>;
  }

  if (purchases.error) {
    return <div className="text-center py-8 text-red-500">Erro ao carregar compras</div>;
  }

  const purchaseData = purchases.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Compras</CardTitle>
      </CardHeader>
      <CardContent>
        {purchaseData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma compra registrada ainda.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseData.map((purchase: Purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">
                    #{purchase.purchase_number}
                  </TableCell>
                  <TableCell>{purchase.supplier_name}</TableCell>
                  <TableCell>
                    {format(new Date(purchase.purchase_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>{getCategoryLabel(purchase.category)}</TableCell>
                  <TableCell className="font-semibold">
                    R$ {purchase.final_amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(purchase.payment_status)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        {purchase.payment_status === 'pending' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(purchase.id, 'paid')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Marcar como Pago
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(purchase.id, 'cancelled')}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancelar
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PurchaseList;
