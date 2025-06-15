
import React, { useState } from 'react';
import { Building, Clock, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface WorkshopSetupStepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const WorkshopSetupStep: React.FC<WorkshopSetupStepProps> = ({ onNext, onSkip }) => {
  const [formData, setFormData] = useState({
    workshopName: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    mondayHours: '08:00-18:00',
    tuesdayHours: '08:00-18:00',
    wednesdayHours: '08:00-18:00',
    thursdayHours: '08:00-18:00',
    fridayHours: '08:00-18:00',
    saturdayHours: '08:00-12:00',
    sundayHours: 'Fechado'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Aqui você salvaria os dados
    console.log('Saving workshop data:', formData);
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-full flex items-center justify-center mx-auto">
          <Building className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-torqx-primary font-satoshi">
          Configure sua Oficina
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Complete as informações da sua oficina para personalizar a experiência e 
          permitir que seus clientes encontrem você facilmente.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Informações Básicas */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-torqx-primary flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Informações Básicas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workshopName">Nome da Oficina *</Label>
              <Input
                id="workshopName"
                value={formData.workshopName}
                onChange={(e) => handleInputChange('workshopName', e.target.value)}
                placeholder="Auto Service Silva"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contato@oficina.com"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Especializada em carros nacionais e importados..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="address">Endereço Completo</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Rua das Flores, 123 - Centro - São Paulo/SP"
            />
          </div>
        </div>

        {/* Horários de Funcionamento */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-torqx-primary flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Horários de Funcionamento
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mondayHours">Segunda-feira</Label>
              <Input
                id="mondayHours"
                value={formData.mondayHours}
                onChange={(e) => handleInputChange('mondayHours', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="tuesdayHours">Terça-feira</Label>
              <Input
                id="tuesdayHours"
                value={formData.tuesdayHours}
                onChange={(e) => handleInputChange('tuesdayHours', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="wednesdayHours">Quarta-feira</Label>
              <Input
                id="wednesdayHours"
                value={formData.wednesdayHours}
                onChange={(e) => handleInputChange('wednesdayHours', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="thursdayHours">Quinta-feira</Label>
              <Input
                id="thursdayHours"
                value={formData.thursdayHours}
                onChange={(e) => handleInputChange('thursdayHours', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="fridayHours">Sexta-feira</Label>
              <Input
                id="fridayHours"
                value={formData.fridayHours}
                onChange={(e) => handleInputChange('fridayHours', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="saturdayHours">Sábado</Label>
              <Input
                id="saturdayHours"
                value={formData.saturdayHours}
                onChange={(e) => handleInputChange('saturdayHours', e.target.value)}
              />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <Label htmlFor="sundayHours">Domingo</Label>
            <Input
              id="sundayHours"
              value={formData.sundayHours}
              onChange={(e) => handleInputChange('sundayHours', e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4">
          {onSkip && (
            <Button variant="outline" onClick={onSkip}>
              Pular por agora
            </Button>
          )}
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white ml-auto"
            disabled={!formData.workshopName || !formData.phone}
          >
            Salvar e Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopSetupStep;
