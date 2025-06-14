
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileSpreadsheet, Download, Upload, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useCreateCustomer } from '@/hooks/useCustomers';
import { toast } from 'sonner';

interface ImportCustomer {
  name: string;
  email?: string;
  phone: string;
  document_number?: string;
  customer_type: 'individual' | 'business';
  secondary_phone?: string;
  preferred_contact: 'phone' | 'email' | 'whatsapp';
  notes?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  additionalComments?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const CustomerImport = () => {
  const [csvData, setCsvData] = useState('');
  const [parsedData, setParsedData] = useState<ImportCustomer[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const createCustomer = useCreateCustomer();

  const requiredFields = [
    { field: 'name', label: 'Nome/Razão Social', required: true },
    { field: 'phone', label: 'Telefone', required: true },
    { field: 'email', label: 'E-mail', required: false },
    { field: 'document_number', label: 'CPF/CNPJ', required: false },
    { field: 'customer_type', label: 'Tipo (individual/business)', required: true },
    { field: 'secondary_phone', label: 'Telefone Secundário', required: false },
    { field: 'preferred_contact', label: 'Contato Preferido (phone/email/whatsapp)', required: false },
    { field: 'address_street', label: 'Endereço - Rua', required: false },
    { field: 'address_number', label: 'Endereço - Número', required: false },
    { field: 'address_neighborhood', label: 'Endereço - Bairro', required: false },
    { field: 'address_city', label: 'Endereço - Cidade', required: false },
    { field: 'address_state', label: 'Endereço - Estado', required: false },
    { field: 'address_zipcode', label: 'Endereço - CEP', required: false },
    { field: 'notes', label: 'Observações', required: false }
  ];

  const generateTemplate = () => {
    const headers = requiredFields.map(field => field.label).join('\t');
    const example = [
      'João Silva',
      '(11) 99999-9999',
      'joao@email.com',
      '123.456.789-00',
      'individual',
      '(11) 88888-8888',
      'phone',
      'Rua das Flores',
      '123',
      'Centro',
      'São Paulo',
      'SP',
      '01000-000',
      'Cliente VIP'
    ].join('\t');

    return `${headers}\n${example}`;
  };

  const downloadTemplate = () => {
    const template = generateTemplate();
    const blob = new Blob([template], { type: 'text/tab-separated-values' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_clientes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone) || phone.length >= 10;
  };

  const parseCsvData = (data: string) => {
    try {
      const lines = data.trim().split('\n');
      if (lines.length < 2) {
        toast.error('Dados insuficientes. Inclua pelo menos o cabeçalho e uma linha de dados.');
        return;
      }

      const headers = lines[0].split('\t').map(h => h.trim());
      const validationErrors: ValidationError[] = [];
      const customers: ImportCustomer[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split('\t').map(v => v.trim());
        const customer: any = {};
        let additionalInfo = '';

        // Mapear campos obrigatórios
        headers.forEach((header, index) => {
          const value = values[index] || '';
          
          switch (header.toLowerCase()) {
            case 'nome/razão social':
              customer.name = value;
              break;
            case 'telefone':
              customer.phone = value;
              break;
            case 'e-mail':
              customer.email = value;
              break;
            case 'cpf/cnpj':
              customer.document_number = value;
              break;
            case 'tipo (individual/business)':
              customer.customer_type = value.toLowerCase() === 'business' ? 'business' : 'individual';
              break;
            case 'telefone secundário':
              customer.secondary_phone = value;
              break;
            case 'contato preferido (phone/email/whatsapp)':
              const contact = value.toLowerCase();
              customer.preferred_contact = ['phone', 'email', 'whatsapp'].includes(contact) ? contact : 'phone';
              break;
            case 'endereço - rua':
              if (!customer.address) customer.address = {};
              customer.address.street = value;
              break;
            case 'endereço - número':
              if (!customer.address) customer.address = {};
              customer.address.number = value;
              break;
            case 'endereço - bairro':
              if (!customer.address) customer.address = {};
              customer.address.neighborhood = value;
              break;
            case 'endereço - cidade':
              if (!customer.address) customer.address = {};
              customer.address.city = value;
              break;
            case 'endereço - estado':
              if (!customer.address) customer.address = {};
              customer.address.state = value;
              break;
            case 'endereço - cep':
              if (!customer.address) customer.address = {};
              customer.address.zipCode = value;
              break;
            case 'observações':
              customer.notes = value;
              break;
            default:
              if (value) {
                additionalInfo += `${header}: ${value}\n`;
              }
          }
        });

        // Adicionar informações extras como comentários
        if (additionalInfo) {
          customer.additionalComments = additionalInfo.trim();
          customer.notes = customer.notes ? `${customer.notes}\n\nInformações adicionais:\n${additionalInfo}` : `Informações adicionais:\n${additionalInfo}`;
        }

        // Validações
        if (!customer.name) {
          validationErrors.push({ row: i + 1, field: 'name', message: 'Nome é obrigatório' });
        }

        if (!customer.phone) {
          validationErrors.push({ row: i + 1, field: 'phone', message: 'Telefone é obrigatório' });
        } else if (!validatePhone(customer.phone)) {
          validationErrors.push({ row: i + 1, field: 'phone', message: 'Formato de telefone inválido' });
        }

        if (customer.email && !validateEmail(customer.email)) {
          validationErrors.push({ row: i + 1, field: 'email', message: 'Formato de e-mail inválido' });
        }

        customers.push(customer);
      }

      setParsedData(customers);
      setErrors(validationErrors);
      setIsValid(validationErrors.length === 0);

      if (validationErrors.length === 0) {
        toast.success(`${customers.length} cliente(s) válido(s) para importação`);
      } else {
        toast.error(`${validationErrors.length} erro(s) encontrado(s)`);
      }
    } catch (error) {
      toast.error('Erro ao processar dados. Verifique o formato.');
      console.error('Erro na importação:', error);
    }
  };

  const importCustomers = async () => {
    if (!isValid || parsedData.length === 0) return;

    setIsImporting(true);
    let successCount = 0;
    let errorCount = 0;

    for (const customer of parsedData) {
      try {
        await createCustomer.mutateAsync({
          ...customer,
          status: 'active' as const,
          credit_limit: 0,
          payment_terms: 0,
          total_spent: 0,
          total_orders: 0,
          last_service_date: null,
          preferred_technician_id: null
        });
        successCount++;
      } catch (error) {
        errorCount++;
        console.error('Erro ao importar cliente:', customer.name, error);
      }
    }

    setIsImporting(false);
    
    if (errorCount === 0) {
      toast.success(`${successCount} cliente(s) importado(s) com sucesso!`);
      setCsvData('');
      setParsedData([]);
      setErrors([]);
      setIsValid(false);
    } else {
      toast.error(`${successCount} importado(s), ${errorCount} erro(s)`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Importar do Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Clientes do Excel</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instruções e Template */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Como importar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  1. Baixe o template abaixo<br/>
                  2. Preencha os dados no Excel (separe colunas por TAB)<br/>
                  3. Copie os dados do Excel e cole na área de texto<br/>
                  4. Campos adicionais serão automaticamente adicionados como comentários
                </AlertDescription>
              </Alert>

              <Button onClick={downloadTemplate} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Baixar Template
              </Button>

              <div className="space-y-2">
                <Label>Campos disponíveis:</Label>
                <div className="flex flex-wrap gap-2">
                  {requiredFields.map((field) => (
                    <Badge key={field.field} variant={field.required ? "default" : "secondary"}>
                      {field.label} {field.required && '*'}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Área de dados */}
          <div className="space-y-4">
            <Label htmlFor="csv-data">Cole os dados do Excel aqui:</Label>
            <Textarea
              id="csv-data"
              placeholder="Cole os dados copiados do Excel aqui..."
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              rows={8}
            />
            <Button onClick={() => parseCsvData(csvData)} disabled={!csvData.trim()}>
              <Upload className="w-4 h-4 mr-2" />
              Processar Dados
            </Button>
          </div>

          {/* Erros de validação */}
          {errors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Erros encontrados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600">
                      Linha {error.row}, campo {error.field}: {error.message}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview dos dados */}
          {parsedData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Preview dos dados ({parsedData.length} clientes)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Observações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.map((customer, index) => (
                        <TableRow key={index}>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>{customer.email || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={customer.customer_type === 'business' ? 'default' : 'secondary'}>
                              {customer.customer_type === 'business' ? 'Empresa' : 'Pessoa Física'}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{customer.notes || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={importCustomers} 
                    disabled={!isValid || isImporting}
                    className="bg-torqx-secondary hover:bg-torqx-secondary-dark"
                  >
                    {isImporting ? 'Importando...' : `Importar ${parsedData.length} Cliente(s)`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerImport;
