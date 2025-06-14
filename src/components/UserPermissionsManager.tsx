
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { SystemModule, UserPermission } from '@/hooks/useTeamManagement';
import { 
  Users, Car, FileText, Package, ShoppingCart, 
  Truck, Calendar, BarChart3, Bot, MessageSquare, 
  Settings 
} from 'lucide-react';

interface UserPermissionsManagerProps {
  modules: SystemModule[];
  initialPermissions: UserPermission[];
  onSave: (permissions: Record<string, UserPermission>) => void;
  loading?: boolean;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  'users': Users,
  'car': Car,
  'file-text': FileText,
  'package': Package,
  'shopping-cart': ShoppingCart,
  'truck': Truck,
  'calendar': Calendar,
  'bar-chart-3': BarChart3,
  'bot': Bot,
  'message-square': MessageSquare,
  'settings': Settings
};

const categoryColors: Record<string, string> = {
  'core': 'bg-blue-100 text-blue-800',
  'operations': 'bg-green-100 text-green-800',
  'scheduling': 'bg-purple-100 text-purple-800',
  'analytics': 'bg-orange-100 text-orange-800',
  'ai': 'bg-pink-100 text-pink-800',
  'admin': 'bg-red-100 text-red-800'
};

const UserPermissionsManager = ({ 
  modules, 
  initialPermissions, 
  onSave, 
  loading = false 
}: UserPermissionsManagerProps) => {
  const [permissions, setPermissions] = useState<Record<string, UserPermission>>({});

  useEffect(() => {
    const permissionsMap: Record<string, UserPermission> = {};
    
    // Inicializar com permissões existentes
    initialPermissions.forEach(perm => {
      permissionsMap[perm.module_name] = perm;
    });

    // Adicionar módulos sem permissões com valores padrão
    modules.forEach(module => {
      if (!permissionsMap[module.name]) {
        permissionsMap[module.name] = {
          module_name: module.name,
          can_create: false,
          can_read: false,
          can_update: false,
          can_delete: false
        };
      }
    });

    setPermissions(permissionsMap);
  }, [modules, initialPermissions]);

  const updatePermission = (moduleName: string, permissionType: keyof UserPermission, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [moduleName]: {
        ...prev[moduleName],
        [permissionType]: value
      }
    }));
  };

  const toggleAllPermissions = (moduleName: string, enable: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [moduleName]: {
        ...prev[moduleName],
        can_create: enable,
        can_read: enable,
        can_update: enable,
        can_delete: enable
      }
    }));
  };

  const handleSave = () => {
    onSave(permissions);
  };

  const groupedModules = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, SystemModule[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedModules).map(([category, categoryModules]) => (
        <Card key={category} className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="font-satoshi text-lg text-torqx-primary">
                {category === 'core' && 'Módulos Principais'}
                {category === 'operations' && 'Operações'}
                {category === 'scheduling' && 'Agendamento'}
                {category === 'analytics' && 'Análises'}
                {category === 'ai' && 'Inteligência Artificial'}
                {category === 'admin' && 'Administração'}
              </span>
              <Badge className={categoryColors[category] || 'bg-gray-100 text-gray-800'}>
                {categoryModules.length} módulos
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryModules.map(module => {
                const IconComponent = iconMap[module.icon] || Settings;
                const modulePermissions = permissions[module.name];

                if (!modulePermissions) return null;

                return (
                  <div key={module.name} className="border rounded-xl p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <IconComponent className="w-5 h-5 text-torqx-secondary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-torqx-primary">{module.display_name}</h4>
                          <p className="text-sm text-gray-600">{module.description}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAllPermissions(module.name, true)}
                          className="text-xs"
                        >
                          Permitir Tudo
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAllPermissions(module.name, false)}
                          className="text-xs"
                        >
                          Remover Tudo
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${module.name}-create`}
                          checked={modulePermissions.can_create}
                          onCheckedChange={(checked) => 
                            updatePermission(module.name, 'can_create', checked as boolean)
                          }
                        />
                        <label 
                          htmlFor={`${module.name}-create`}
                          className="text-sm font-medium text-green-700"
                        >
                          Criar
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${module.name}-read`}
                          checked={modulePermissions.can_read}
                          onCheckedChange={(checked) => 
                            updatePermission(module.name, 'can_read', checked as boolean)
                          }
                        />
                        <label 
                          htmlFor={`${module.name}-read`}
                          className="text-sm font-medium text-blue-700"
                        >
                          Visualizar
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${module.name}-update`}
                          checked={modulePermissions.can_update}
                          onCheckedChange={(checked) => 
                            updatePermission(module.name, 'can_update', checked as boolean)
                          }
                        />
                        <label 
                          htmlFor={`${module.name}-update`}
                          className="text-sm font-medium text-orange-700"
                        >
                          Editar
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${module.name}-delete`}
                          checked={modulePermissions.can_delete}
                          onCheckedChange={(checked) => 
                            updatePermission(module.name, 'can_delete', checked as boolean)
                          }
                        />
                        <label 
                          htmlFor={`${module.name}-delete`}
                          className="text-sm font-medium text-red-700"
                        >
                          Excluir
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end pt-6">
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="bg-torqx-secondary hover:bg-torqx-secondary-dark text-white"
        >
          {loading ? 'Salvando...' : 'Salvar Permissões'}
        </Button>
      </div>
    </div>
  );
};

export default UserPermissionsManager;
