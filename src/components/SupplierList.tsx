
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, Edit, Trash2, Phone, Mail, Star } from 'lucide-react';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useToast } from '@/hooks/use-toast';

const SupplierList = () => {
  const { suppliers, deleteSupplier } = useSuppliers();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  if (suppliers.isLoading) {
    return <div className="text-center py-8">Carregando fornecedores...</div>;
  }

  const suppliersData = suppliers.data || [];
  
  const filteredSuppliers = suppliersData.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.document_number?.includes(searchTerm) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o fornecedor "${name}"?`)) {
      try {
        await deleteSupplier.mutateAsync(id);
        toast({ title: "Sucesso", description: "Fornecedor excluído com sucesso!" });
      } catch (error) {
        console.error('Erro ao excluir fornecedor:', error);
        toast({ title: "Erro", description: "Erro ao excluir fornecedor", variant: "destructive" });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'active': { label: 'Ativo', variant: 'default' as const },
      'inactive': { label: 'Inativo', variant: 'secondary' as const },
      'suspended': { label: 'Suspenso', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Fornecedores</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar fornecedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredSuppliers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Nenhum fornecedor encontrado.' : 'Nenhum fornecedor cadastrado.'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome/Razão Social</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Avaliação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <div className="font-semibold">{supplier.name}</div>
                      {supplier.business_name && (
                        <div className="text-sm text-gray-500">{supplier.business_name}</div>
                      )}
                      {supplier.contact_person && (
                        <div className="text-xs text-gray-400">Contato: {supplier.contact_person}</div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {supplier.document_number && (
                      <div className="text-sm">
                        <Badge variant="outline">
                          {supplier.document_type?.toUpperCase()}: {supplier.document_number}
                        </Badge>
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      {supplier.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1" />
                          {supplier.email}
                        </div>
                      )}
                      {supplier.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1" />
                          {supplier.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline">{supplier.category}</Badge>
                  </TableCell>
                  
                  <TableCell>
                    {getRatingStars(supplier.rating)}
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(supplier.status)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(supplier.id, supplier.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default SupplierList;
