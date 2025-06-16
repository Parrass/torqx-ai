
import React from 'react';
import { useModulePermissions } from '@/hooks/useModulePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface PermissionGateProps {
  children: React.ReactNode;
  module: string;
  permission?: 'create' | 'read' | 'update' | 'delete';
  fallback?: React.ReactNode;
  showError?: boolean;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  module,
  permission = 'read',
  fallback,
  showError = true
}) => {
  const { hasPermission, userRole, loading } = useModulePermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-torqx-secondary"></div>
      </div>
    );
  }

  // Owners sempre têm acesso
  if (userRole === 'owner') {
    return <>{children}</>;
  }

  const hasAccess = hasPermission(module, permission);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showError) {
      return (
        <Alert className="border-red-200 bg-red-50">
          <Shield className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Você não tem permissão para {permission === 'create' ? 'criar' : permission === 'read' ? 'visualizar' : permission === 'update' ? 'editar' : 'excluir'} {module === 'customers' ? 'clientes' : 'este recurso'}.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  }

  return <>{children}</>;
};

export default PermissionGate;
