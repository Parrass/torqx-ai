
import React, { useState } from 'react';
import { Plus, Edit, Users, Shield, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/DashboardLayout';
import UserForm from '@/components/UserForm';
import UserPermissionsManager from '@/components/UserPermissionsManager';
import { useTeamManagement, TeamUser, UserPermission } from '@/hooks/useTeamManagement';

const TeamManagement = () => {
  const { users, modules, loading, createUser, updateUserPermissions, updateUserStatus } = useTeamManagement();
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<TeamUser | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Nunca';
    return new Date(lastLogin).toLocaleDateString('pt-BR');
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'manager': 'Gerente',
      'technician': 'Técnico',
      'admin': 'Administrador',
      'receptionist': 'Recepcionista'
    };
    return roleMap[role] || role;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800">Inativo</Badge>;
  };

  const countPermissions = (permissions: UserPermission[]) => {
    return permissions.reduce((acc, perm) => {
      if (perm.can_create) acc++;
      if (perm.can_read) acc++;
      if (perm.can_update) acc++;
      if (perm.can_delete) acc++;
      return acc;
    }, 0);
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    await updateUserStatus(userId, newStatus);
  };

  const handleEditPermissions = (user: TeamUser) => {
    setEditingUser(user);
    setShowPermissions(true);
  };

  const handleSavePermissions = async (permissions: Record<string, UserPermission>) => {
    if (!editingUser) return;
    
    const result = await updateUserPermissions(editingUser.id, permissions);
    if (result.success) {
      setEditingUser(null);
      setShowPermissions(false);
    }
  };

  const stats = [
    {
      title: 'Total de Usuários',
      value: users.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Usuários Ativos',
      value: users.filter(u => u.status === 'active').length,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Usuários Inativos',
      value: users.filter(u => u.status !== 'active').length,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Módulos Disponíveis',
      value: modules.length,
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-torqx-primary font-satoshi">
                Gestão de Equipe
              </h1>
              <p className="text-gray-600 mt-2">
                Gerencie usuários e suas permissões modulares
              </p>
            </div>
            <Button
              onClick={() => setShowAddUser(true)}
              className="bg-torqx-secondary hover:bg-torqx-secondary-dark text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Usuário
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-torqx-primary font-satoshi">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Users Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="font-satoshi text-xl text-torqx-primary">
                Usuários da Equipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-torqx-secondary mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando usuários...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum usuário cadastrado</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Usuário</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Cargo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Último Login</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Permissões</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-torqx-primary">{user.full_name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              {user.phone && (
                                <p className="text-sm text-gray-500">{user.phone}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="outline">
                              {getRoleLabel(user.role)}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Select
                              value={user.status}
                              onValueChange={(value) => handleStatusChange(user.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="inactive">Inativo</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {formatLastLogin(user.last_login_at)}
                          </td>
                          <td className="py-4 px-4">
                            <Badge className="bg-blue-100 text-blue-800">
                              {countPermissions(user.permissions)} permissões
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPermissions(user)}
                              className="flex items-center space-x-1"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Editar</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add User Dialog */}
        <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            </DialogHeader>
            <UserForm
              modules={modules}
              onSubmit={createUser}
              loading={loading}
              onCancel={() => setShowAddUser(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Permissions Dialog */}
        <Dialog open={showPermissions} onOpenChange={setShowPermissions}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Editar Permissões - {editingUser?.full_name}
              </DialogTitle>
            </DialogHeader>
            {editingUser && (
              <UserPermissionsManager
                modules={modules}
                initialPermissions={editingUser.permissions}
                onSave={handleSavePermissions}
                loading={loading}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TeamManagement;
