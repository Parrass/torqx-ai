
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LandingHeader from '@/components/LandingHeader';
import HeroSection from '@/components/HeroSection';
import SolutionSection from '@/components/SolutionSection';
import ROICalculator from '@/components/ROICalculator';
import CaseStudies from '@/components/CaseStudies';
import PricingSection from '@/components/PricingSection';
import FinalCTA from '@/components/FinalCTA';
import LandingFooter from '@/components/LandingFooter';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se o usuário está autenticado, redirecionar para o dashboard
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-torqx-secondary mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se o usuário não está autenticado, mostrar landing page
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <LandingHeader />
        <main>
          <HeroSection />
          <SolutionSection />
          <ROICalculator />
          <CaseStudies />
          <PricingSection />
          <FinalCTA />
        </main>
        <LandingFooter />
      </div>
    );
  }

  // Fallback (não deve acontecer devido ao useEffect)
  return null;
};

export default Index;
