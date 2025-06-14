
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Eye, MoreHorizontal, Calendar, Building } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Purchase {
  id: string;
  purchase_number: number;
  supplier_name: string;
  purchase_date: string;
  final_amount: number;
  payment_status: string;
  category: string;
  due_date?: string;
}

interface PurchasesListProps {
  purchases: Purchase[];
  searchTerm: string;
  isLoading: boolean;
  onEdit: (purchase: Purchase) => void;
}

const getStatusBadge = (status: string) => {
  const statusMap = {
    pending: { label: 'Pendente', variant: 'secondary' as const },
    paid: { label: 'Pago', variant: 'default' as const },
    overdue: { label: 'Em Atraso', variant: 'destructive' as const },
    partial: { label: 'Parcial', variant: 'outline' as const },
  };

  const statusInfo = statusMap[status as keyof typeof statusMap] || {
    label: 'Desconhecido',
    variant: 'secondary' as const,
  };

  return (
    <Badge variant={statusInfo.variant} className="font-medium">
      {statusInfo.label}
    </Badge>
  );
};

const getCategoryBadge = (category: string) => {
  const categoryMap = {
    general: { label: 'Geral', color: 'bg-gray-100 text-gray-800' },
    inventory: { label: 'Estoque', color: 'bg-blue-100 text-blue-800' },
    tools: { label: 'Ferramentas', color: 'bg-green-100 text-green-800' },
    office: { label: 'Escritório', color: 'bg-purple-100 text-purple-800' },
    maintenance: { label: 'Manutenção', color: 'bg-orange-100 text-orange-800' },
  };

  const categoryInfo = categoryMap[category as keyof typeof categoryMap] || {
    label: 'Outro',
    color: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
      {categoryInfo.label}
    </span>
  );
};

export const PurchasesList = ({ purchases, searchTerm, isLoading, onEdit }: PurchasesListProps) => {
  const filteredPurchases = purchases.filter(purchase =>
    purchase.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.purchase_number.toString().includes(searchTerm)
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredPurchases.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {searchTerm ? 'Nenhuma compra encontrada' : 'Nenhuma compra cadastrada'}
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando sua primeira compra'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPurchases.map((purchase) => (
              <TableRow key={purchase.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  #{purchase.purchase_number}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{purchase.supplier_name}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(new Date(purchase.purchase_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                </TableCell>
                <TableCell>
                  {getCategoryBadge(purchase.category)}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-torqx-primary">
                    R$ {parseFloat(purchase.final_amount.toString()).toLocaleString('pt-BR', { 
                      minimumFractionDigits: 2 
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(purchase.payment_status)}
                </TableCell>
                <TableCell>
                  {purchase.due_date ? (
                    <div className="text-sm text-gray-600">
                      {format(new Date(purchase.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(purchase)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
