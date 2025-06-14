
import React, { useEffect } from 'react';
import LandingHeader from '../components/LandingHeader';
import HeroSection from '../components/HeroSection';
import SolutionSection from '../components/SolutionSection';
import ROICalculator from '../components/ROICalculator';
import CaseStudies from '../components/CaseStudies';
import PricingSection from '../components/PricingSection';
import FinalCTA from '../components/FinalCTA';
import LandingFooter from '../components/LandingFooter';

const Index = () => {
  useEffect(() => {
    // ROI Calculator functionality
    const calculateROI = () => {
      const osMonth = parseInt((document.getElementById('os-month') as HTMLInputElement)?.value) || 150;
      const ticketMedio = parseInt((document.getElementById('ticket-medio') as HTMLInputElement)?.value) || 350;
      const horasAdmin = parseInt((document.getElementById('horas-admin') as HTMLInputElement)?.value) || 20;
      
      // Cálculos baseados nas métricas Torqx
      const novoTicket = ticketMedio * 1.4; // 40% aumento
      const novaReceita = osMonth * novoTicket;
      const economiaTempo = horasAdmin * 0.6 * 50; // 60% economia * R$50/hora
      const economiaMensal = (novaReceita - (osMonth * ticketMedio)) + economiaTempo;
      const roiAnual = ((economiaMensal * 12) / (197 * 12)) * 100;
      
      // Atualizar DOM
      const economiaMensalEl = document.getElementById('economia-mensal');
      const novaReceitaEl = document.getElementById('nova-receita');
      const roiAnualEl = document.getElementById('roi-anual');
      
      if (economiaMensalEl) economiaMensalEl.textContent = `R$ ${economiaMensal.toLocaleString()}`;
      if (novaReceitaEl) novaReceitaEl.textContent = `R$ ${novaReceita.toLocaleString()}`;
      if (roiAnualEl) roiAnualEl.textContent = `${Math.round(roiAnual)}%`;
    };

    // Event listeners para inputs
    const inputs = ['os-month', 'ticket-medio', 'horas-admin'];
    inputs.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', calculateROI);
      }
    });
    
    // Calcular valores iniciais
    calculateROI();

    // Smooth scroll para navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href')!);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Cleanup
    return () => {
      inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
          input.removeEventListener('input', calculateROI);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <HeroSection />
      <SolutionSection />
      <ROICalculator />
      <CaseStudies />
      <PricingSection />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
};

export default Index;
