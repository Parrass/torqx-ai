
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Package, ShoppingCart, ArrowRight } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { useNavigate } from 'react-router-dom';

const InventoryAlerts: React.FC = () => {
  const { inventoryAlerts } = useInventory();
  const navigate = useNavigate();

  const alerts = inventoryAlerts.data || [];
  
  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'warning':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'low':
        return <Package className="w-4 h-4 text-yellow-600" />;
      default:
        return <Package className="w-4 h-4 text-orange-600" />;
    }
  };

  const criticalAlerts = alerts.filter(alert => alert.alert_level === 'critical');
  const otherAlerts = alerts.filter(alert => alert.alert_level !== 'critical');

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <CardTitle className="text-lg font-semibold text-torqx-primary font-satoshi">
            Alertas de Estoque
          </CardTitle>
        </div>
        {alerts.length > 0 && (
          <Badge variant="destructive" className="text-xs">
            {alerts.length}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Estoque OK!</p>
            <p className="text-xs text-gray-400">
              Todas as peças estão com níveis adequados
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Alertas críticos primeiro */}
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getAlertIcon(alert.alert_level)}
                  <div className="flex-1">
                    <div className="font-medium text-sm text-red-900">
                      {alert.name}
                    </div>
                    <div className="text-xs text-red-700">
                      Estoque: {alert.current_stock || 0} | Mínimo: {alert.minimum_stock}
                    </div>
                    {alert.sku && (
                      <div className="text-xs text-red-600">
                        SKU: {alert.sku}
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={getAlertColor(alert.alert_level)}>
                  {alert.alert_level === 'critical' ? 'CRÍTICO' : 'BAIXO'}
                </Badge>
              </div>
            ))}

            {/* Outros alertas */}
            {otherAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getAlertIcon(alert.alert_level)}
                  <div className="flex-1">
                    <div className="font-medium text-sm text-yellow-900">
                      {alert.name}
                    </div>
                    <div className="text-xs text-yellow-700">
                      Estoque: {alert.current_stock || 0} | Mínimo: {alert.minimum_stock}
                    </div>
                  </div>
                </div>
                <Badge className={getAlertColor(alert.alert_level)}>
                  BAIXO
                </Badge>
              </div>
            ))}

            {/* Botões de ação */}
            <div className="flex flex-col space-y-2 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/inventory')}
                className="w-full text-torqx-secondary hover:text-torqx-secondary-dark border-torqx-secondary/20 hover:border-torqx-secondary"
              >
                <Package className="w-4 h-4 mr-2" />
                Ver Estoque
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
              
              {criticalAlerts.length > 0 && (
                <Button
                  size="sm"
                  onClick={() => navigate('/purchases')}
                  className="w-full bg-gradient-to-r from-torqx-accent to-torqx-accent-dark"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Fazer Pedido
                </Button>
              )}

              {otherAlerts.length > 3 && (
                <p className="text-xs text-gray-500 text-center">
                  +{otherAlerts.length - 3} outros alertas
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryAlerts;
