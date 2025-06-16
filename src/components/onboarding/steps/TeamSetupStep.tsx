
import React, { useState } from 'react';
import { Users, UserPlus, Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface TeamSetupStepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const TeamSetupStep: React.FC<TeamSetupStepProps> = ({ onNext, onSkip }) => {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: '', email: '', role: 'technician' }
  ]);

  const addTeamMember = () => {
    setTeamMembers(prev => [
      ...prev,
      { id: prev.length + 1, name: '', email: '', role: 'technician' }
    ]);
  };

  const updateTeamMember = (id: number, field: string, value: string) => {
    setTeamMembers(prev =>
      prev.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const removeTeamMember = (id: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(prev => prev.filter(member => member.id !== id));
    }
  };

  const handleSubmit = () => {
    console.log('Saving team members for later invitation:', teamMembers);
    // Nota: Os convites serão enviados posteriormente via Team Management
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-full flex items-center justify-center mx-auto">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-torqx-primary font-satoshi">
          Configure sua Equipe
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Configure os membros da sua equipe agora ou pule esta etapa. 
          Você pode convidar novos membros a qualquer momento pela seção "Gestão de Equipe".
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Info sobre o sistema de convites */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Sistema de Convites por Email</h3>
                <p className="text-sm text-blue-800">
                  Quando você adicionar membros aqui, eles receberão um convite por email com um link mágico 
                  para acessar a plataforma. Eles poderão definir sua própria senha no primeiro acesso.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roles Info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Tipos de Usuário
          </h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Proprietário:</strong> Acesso total ao sistema (você já é o proprietário)</p>
            <p><strong>Gerente:</strong> Pode gerenciar operações e ver relatórios</p>
            <p><strong>Técnico:</strong> Pode atualizar ordens de serviço e acessar informações técnicas</p>
            <p><strong>Recepcionista:</strong> Pode gerenciar clientes e agendamentos</p>
          </div>
        </div>

        {/* Team Members */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-torqx-primary">
            Membros da Equipe
          </h3>
          
          {teamMembers.map((member, index) => (
            <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`name-${member.id}`}>Nome</Label>
                  <Input
                    id={`name-${member.id}`}
                    value={member.name}
                    onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                    placeholder="João Silva"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`email-${member.id}`}>Email</Label>
                  <Input
                    id={`email-${member.id}`}
                    type="email"
                    value={member.email}
                    onChange={(e) => updateTeamMember(member.id, 'email', e.target.value)}
                    placeholder="joao@oficina.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`role-${member.id}`}>Função</Label>
                  <Select 
                    value={member.role} 
                    onValueChange={(value) => updateTeamMember(member.id, 'role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="technician">Técnico</SelectItem>
                      <SelectItem value="receptionist">Recepcionista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {teamMembers.length > 1 && (
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTeamMember(member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remover
                  </Button>
                </div>
              )}
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={addTeamMember}
            className="w-full flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Adicionar Membro</span>
          </Button>
        </div>

        {/* Info adicional */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Importante:</strong> Após concluir o onboarding, você poderá enviar os convites 
            para os membros da equipe na seção "Gestão de Equipe" do sistema.
          </p>
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
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamSetupStep;
