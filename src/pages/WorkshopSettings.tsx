
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Upload, 
  Phone, 
  Mail, 
  MapPin, 
  FileText,
  Wrench,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';

const WorkshopSettings = () => {
  const [services, setServices] = useState([
    { id: 1, name: 'Troca de Óleo', category: 'Manutenção Preventiva', price: 150.00 },
    { id: 2, name: 'Alinhamento e Balanceamento', category: 'Pneus e Rodas', price: 80.00 },
    { id: 3, name: 'Freios', category: 'Sistema de Freios', price: 300.00 },
  ]);

  const [newService, setNewService] = useState({ name: '', category: '', price: '' });

  const addService = () => {
    if (newService.name && newService.category && newService.price) {
      setServices([
        ...services,
        {
          id: Date.now(),
          name: newService.name,
          category: newService.category,
          price: parseFloat(newService.price)
        }
      ]);
      setNewService({ name: '', category: '', price: '' });
    }
  };

  const removeService = (id: number) => {
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-torqx-primary flex items-center gap-2">
            <Building2 className="w-8 h-8 text-torqx-secondary" />
            Configurações da Oficina
          </h1>
          <p className="text-gray-600 mt-2">Gerencie as informações e configurações da sua oficina</p>
        </div>

        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-torqx-secondary" />
              Informações da Empresa
            </CardTitle>
            <CardDescription>Dados básicos da sua oficina</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workshop-name">Nome da Oficina</Label>
                <Input id="workshop-name" placeholder="Auto Center Silva" />
              </div>
              <div>
                <Label htmlFor="business-name">Razão Social</Label>
                <Input id="business-name" placeholder="Silva Serviços Automotivos LTDA" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="12.345.678/0001-90" />
              </div>
              <div>
                <Label htmlFor="ie">Inscrição Estadual</Label>
                <Input id="ie" placeholder="123456789" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descrição da Oficina</Label>
              <Textarea 
                id="description" 
                placeholder="Especializada em serviços automotivos com mais de 20 anos de experiência..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo e Imagens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-torqx-accent" />
              Logo e Imagens
            </CardTitle>
            <CardDescription>Personalize a identidade visual da sua oficina</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Logo Principal</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-torqx-secondary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Clique para enviar logo</p>
                  <p className="text-xs text-gray-400">PNG, JPG até 2MB</p>
                </div>
              </div>
              <div>
                <Label>Foto da Oficina</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-torqx-secondary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Clique para enviar foto</p>
                  <p className="text-xs text-gray-400">PNG, JPG até 5MB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-torqx-primary" />
              Contato e Endereço
            </CardTitle>
            <CardDescription>Informações de contato e localização</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefone Principal</Label>
                <Input id="phone" placeholder="(11) 3333-4444" />
              </div>
              <div>
                <Label htmlFor="mobile">WhatsApp/Celular</Label>
                <Input id="mobile" placeholder="(11) 99999-8888" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="contato@oficina.com" />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="www.oficina.com" />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Endereço Completo</Label>
              <Textarea 
                id="address" 
                placeholder="Rua das Flores, 123, Centro, São Paulo - SP, 01234-567"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Serviços Prestados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-torqx-accent" />
              Serviços Prestados
            </CardTitle>
            <CardDescription>Gerencie o catálogo de serviços da sua oficina</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Adicionar Novo Serviço */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-torqx-primary">Adicionar Novo Serviço</h4>
              <div className="grid md:grid-cols-4 gap-3">
                <Input
                  placeholder="Nome do serviço"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
                <Input
                  placeholder="Categoria"
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                />
                <Input
                  placeholder="Preço base"
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                />
                <Button onClick={addService} className="bg-torqx-accent hover:bg-torqx-accent-dark">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>

            <Separator />

            {/* Lista de Serviços */}
            <div className="space-y-3">
              <h4 className="font-semibold text-torqx-primary">Serviços Cadastrados</h4>
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h5 className="font-medium">{service.name}</h5>
                    <p className="text-sm text-gray-600">{service.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-torqx-primary">
                      R$ {service.price.toFixed(2)}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeService(service.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Horário de Funcionamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-torqx-primary" />
              Horário de Funcionamento
            </CardTitle>
            <CardDescription>Configure os horários de atendimento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'].map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium">{day}</div>
                  <Input className="w-20" placeholder="08:00" />
                  <span className="text-gray-400">às</span>
                  <Input className="w-20" placeholder="18:00" />
                  <Button variant="outline" size="sm">Fechado</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <Button className="bg-torqx-secondary hover:bg-torqx-secondary-dark">
            Salvar Alterações
          </Button>
          <Button variant="outline">
            Cancelar
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkshopSettings;
