
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SystemModule, UserPermission } from '@/hooks/useTeamManagement';
import UserPermissionsManager from './UserPermissionsManager';

const userFormSchema = z.object({
  email: z.string().email('E-mail inválido'),
  full_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().optional(),
  role: z.string().min(1, 'Selecione um cargo'),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
  modules: SystemModule[];
  onSubmit: (userData: {
    email: string;
    full_name: string;
    phone?: string;
    role: string;
    permissions: Record<string, UserPermission>;
  }) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
  onCancel?: () => void;
}

const roles = [
  { value: 'manager', label: 'Gerente' },
  { value: 'technician', label: 'Técnico' },
  { value: 'admin', label: 'Administrador' },
  { value: 'receptionist', label: 'Recepcionista' },
];

const UserForm = ({ modules, onSubmit, loading = false, onCancel }: UserFormProps) => {
  const [permissions, setPermissions] = useState<Record<string, UserPermission>>({});
  const [showPermissions, setShowPermissions] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      full_name: '',
      phone: '',
      role: '',
    },
  });

  // Inicializar permissões vazias
  React.useEffect(() => {
    const initialPermissions: Record<string, UserPermission> = {};
    modules.forEach(module => {
      initialPermissions[module.name] = {
        module_name: module.name,
        can_create: false,
        can_read: false,
        can_update: false,
        can_delete: false
      };
    });
    setPermissions(initialPermissions);
  }, [modules]);

  const handleFormSubmit = async (data: UserFormData) => {
    const result = await onSubmit({
      ...data,
      permissions
    });

    if (result.success) {
      form.reset();
      setPermissions({});
      setShowPermissions(false);
    }
  };

  const handleNext = () => {
    form.trigger().then(isValid => {
      if (isValid) {
        setShowPermissions(true);
      }
    });
  };

  const handleBack = () => {
    setShowPermissions(false);
  };

  if (showPermissions) {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="font-satoshi text-xl text-torqx-primary">
                Definir Permissões
              </span>
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-torqx-primary mb-2">Resumo do Usuário</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Nome:</span>
                  <span className="ml-2 font-medium">{form.getValues('full_name')}</span>
                </div>
                <div>
                  <span className="text-gray-600">E-mail:</span>
                  <span className="ml-2 font-medium">{form.getValues('email')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Cargo:</span>
                  <span className="ml-2 font-medium">
                    {roles.find(r => r.value === form.getValues('role'))?.label}
                  </span>
                </div>
                {form.getValues('phone') && (
                  <div>
                    <span className="text-gray-600">Telefone:</span>
                    <span className="ml-2 font-medium">{form.getValues('phone')}</span>
                  </div>
                )}
              </div>
            </div>

            <UserPermissionsManager
              modules={modules}
              initialPermissions={[]}
              onSave={(newPermissions) => {
                setPermissions(newPermissions);
                handleFormSubmit(form.getValues());
              }}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="font-satoshi text-xl text-torqx-primary">
          Adicionar Novo Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" className="bg-torqx-secondary hover:bg-torqx-secondary-dark text-white">
                Próximo: Definir Permissões
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
