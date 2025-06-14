
import React from "react";
import LandingHeader from "../components/LandingHeader";
import HeroSection from "../components/HeroSection";
import SolutionSection from "../components/SolutionSection";
import ROICalculator from "../components/ROICalculator";
import CaseStudies from "../components/CaseStudies";
import PricingSection from "../components/PricingSection";
import FinalCTA from "../components/FinalCTA";
import LandingFooter from "../components/LandingFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Header/Navegação padrão */}
      <LandingHeader />

      {/* HERO: focado em ROI e diferenciação da IA */}
      <HeroSection />

      {/* Solução completa, 3 pilares */}
      <SolutionSection />

      {/* Seção calculadora de ROI interativa */}
      <ROICalculator />

      {/* Casos de sucesso/Depoimentos */}
      <CaseStudies />

      {/* Preços e planos */}
      <PricingSection />

      {/* Call-to-action com reforço de garantias */}
      <FinalCTA />

      {/* Footer padrão Torqx */}
      <LandingFooter />
    </div>
  );
};

export default Index;
