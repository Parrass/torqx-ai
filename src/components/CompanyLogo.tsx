
import React from 'react';
import { Building2 } from 'lucide-react';
import { useWorkshopSettings } from '@/hooks/useWorkshopSettings';

const CompanyLogo = () => {
  const { settings, loading } = useWorkshopSettings();

  if (loading) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
    );
  }

  const companyName = settings?.workshop_name || settings?.business_name || 'Oficina';
  const logoUrl = settings?.logo_url;

  // Se tem logo, exibe a imagem
  if (logoUrl) {
    return (
      <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200">
        <img 
          src={logoUrl} 
          alt={companyName}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback para placeholder se a imagem não carregar
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = `
              <div class="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <span class="text-xs font-bold text-gray-600">${companyName.charAt(0).toUpperCase()}</span>
              </div>
            `;
          }}
        />
      </div>
    );
  }

  // Fallback: primeira letra do nome da empresa
  return (
    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
      <span className="text-xs font-bold text-gray-600">
        {companyName.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

export default CompanyLogo;
