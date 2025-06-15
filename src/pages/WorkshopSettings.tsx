
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  Upload, 
  Phone, 
  Mail, 
  MapPin, 
  FileText,
  Loader2
} from 'lucide-react';
import { useWorkshopSettings, WorkingHours } from '@/hooks/useWorkshopSettings';

const WorkshopSettings = () => {
  const { settings, loading, saveSettings, updateWorkingHours } = useWorkshopSettings();
  
  const [formData, setFormData] = useState({
    workshop_name: '',
    business_name: '',
    cnpj: '',
    state_registration: '',
    description: '',
    phone: '',
    mobile: '',
    email: '',
    website: '',
    address: ''
  });

  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    saturday: { isOpen: true, openTime: '08:00', closeTime: '12:00' },
    sunday: { isOpen: false, openTime: '08:00', closeTime: '18:00' }
  });

  const [isSaving, setIsSaving] = useState(false);

  const daysOfWeek = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  // Carregar dados quando as configurações chegarem
  useEffect(() => {
    if (settings) {
      setFormData({
        workshop_name: settings.workshop_name || '',
        business_name: settings.business_name || '',
        cnpj: settings.cnpj || '',
        state_registration: settings.state_registration || '',
        description: settings.description || '',
        phone: settings.phone || '',
        mobile: settings.mobile || '',
        email: settings.email || '',
        website: settings.website || '',
        address: settings.address || ''
      });

      // Carregar horários de funcionamento se existirem
      if (settings.working_hours && Object.keys(settings.working_hours).length > 0) {
        setWorkingHours(settings.working_hours);
      }
    }
  }, [settings]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkingHourChange = (day: keyof WorkingHours, field: string, value: string | boolean) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveSettings({
        ...formData,
        working_hours: workingHours
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (settings) {
      setFormData({
        workshop_name: settings.workshop_name || '',
        business_name: settings.business_name || '',
        cnpj: settings.cnpj || '',
        state_registration: settings.state_registration || '',
        description: settings.description || '',
        phone: settings.phone || '',
        mobile: settings.mobile || '',
        email: settings.email || '',
        website: settings.website || '',
        address: settings.address || ''
      });

      if (settings.working_hours && Object.keys(settings.working_hours).length > 0) {
        setWorkingHours(settings.working_hours);
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Carregando configurações...</span>
        </div>
      </DashboardLayout>
    );
  }

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
                <Label htmlFor="workshop-name">Nome da Oficina *</Label>
                <Input 
                  id="workshop-name" 
                  placeholder="Auto Center Silva"
                  value={formData.workshop_name}
                  onChange={(e) => handleInputChange('workshop_name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="business-name">Razão Social</Label>
                <Input 
                  id="business-name" 
                  placeholder="Silva Serviços Automotivos LTDA"
                  value={formData.business_name}
                  onChange={(e) => handleInputChange('business_name', e.target.value)}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input 
                  id="cnpj" 
                  placeholder="12.345.678/0001-90"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange('cnpj', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ie">Inscrição Estadual</Label>
                <Input 
                  id="ie" 
                  placeholder="123456789"
                  value={formData.state_registration}
                  onChange={(e) => handleInputChange('state_registration', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descrição da Oficina</Label>
              <Textarea 
                id="description" 
                placeholder="Especializada em serviços automotivos com mais de 20 anos de experiência..."
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
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
                <Input 
                  id="phone" 
                  placeholder="(11) 3333-4444"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="mobile">WhatsApp/Celular</Label>
                <Input 
                  id="mobile" 
                  placeholder="(11) 99999-8888"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="contato@oficina.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  placeholder="www.oficina.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Endereço Completo</Label>
              <Textarea 
                id="address" 
                placeholder="Rua das Flores, 123, Centro, São Paulo - SP, 01234-567"
                rows={2}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
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
              {daysOfWeek.map((day) => (
                <div key={day.key} className="flex items-center gap-4">
                  <div className="w-28 text-sm font-medium">{day.label}</div>
                  <Input 
                    className="w-20" 
                    type="time"
                    value={workingHours[day.key as keyof WorkingHours]?.openTime || '08:00'}
                    onChange={(e) => handleWorkingHourChange(day.key as keyof WorkingHours, 'openTime', e.target.value)}
                    disabled={!workingHours[day.key as keyof WorkingHours]?.isOpen}
                  />
                  <span className="text-gray-400">às</span>
                  <Input 
                    className="w-20" 
                    type="time"
                    value={workingHours[day.key as keyof WorkingHours]?.closeTime || '18:00'}
                    onChange={(e) => handleWorkingHourChange(day.key as keyof WorkingHours, 'closeTime', e.target.value)}
                    disabled={!workingHours[day.key as keyof WorkingHours]?.isOpen}
                  />
                  <Button 
                    variant={workingHours[day.key as keyof WorkingHours]?.isOpen ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleWorkingHourChange(day.key as keyof WorkingHours, 'isOpen', !workingHours[day.key as keyof WorkingHours]?.isOpen)}
                  >
                    {workingHours[day.key as keyof WorkingHours]?.isOpen ? 'Aberto' : 'Fechado'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <Button 
            onClick={handleSave}
            disabled={isSaving || !formData.workshop_name}
            className="bg-torqx-secondary hover:bg-torqx-secondary-dark"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkshopSettings;
