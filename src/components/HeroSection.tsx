
import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-torqx-primary via-torqx-primary-light to-torqx-primary text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo Principal */}
          <div className="lg:pr-8">
            {/* Badge */}
            <div className="inline-flex items-center bg-torqx-secondary/10 border border-torqx-secondary/20 rounded-full px-6 py-3 mb-8">
              <span className="text-torqx-secondary-light font-medium">🚀 IA Nativa para Oficinas Automotivas</span>
            </div>
            
            {/* Headline Principal */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight">
              Aumente sua receita em
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-torqx-secondary-light to-torqx-accent-light">
                {' '}40% com IA
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl lg:text-2xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              Plataforma completa que automatiza diagnósticos, otimiza agendamentos 
              e aumenta ticket médio com recomendações inteligentes de IA.
            </p>
            
            {/* CTAs Principais */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all">
                Ver Demo ao Vivo
              </button>
              <button className="bg-white/10 backdrop-blur text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all">
                Calcular Meu ROI
              </button>
            </div>
            
            {/* Métricas de Impacto */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-700">
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl font-bold text-torqx-accent-light mb-2">+40%</div>
                <div className="text-slate-400">Receita média</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl font-bold text-torqx-secondary-light mb-2">-60%</div>
                <div className="text-slate-400">Tempo admin</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl font-bold text-torqx-accent-light mb-2">+25%</div>
                <div className="text-slate-400">Clientes novos</div>
              </div>
            </div>
          </div>
          
          {/* Dashboard Mockup */}
          <div className="relative lg:pl-8">
            {/* Container com efeito glass */}
            <div className="relative z-10 bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Dashboard simulado */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                {/* Header do dashboard */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-torqx-primary text-lg">Dashboard Torqx</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                {/* Métricas Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-torqx-secondary/10 to-torqx-secondary/5 p-4 rounded-xl border border-torqx-secondary/10">
                    <div className="text-2xl font-bold text-torqx-secondary">R$ 45.2k</div>
                    <div className="text-sm text-gray-600">Receita este mês</div>
                    <div className="text-xs text-torqx-accent mt-1">+18% vs anterior</div>
                  </div>
                  <div className="bg-gradient-to-br from-torqx-accent/10 to-torqx-accent/5 p-4 rounded-xl border border-torqx-accent/10">
                    <div className="text-2xl font-bold text-torqx-accent">127</div>
                    <div className="text-sm text-gray-600">OS concluídas</div>
                    <div className="text-xs text-torqx-accent mt-1">+12% vs anterior</div>
                  </div>
                </div>
                
                {/* Gráfico simulado */}
                <div className="h-32 bg-gradient-to-r from-torqx-secondary/20 via-torqx-accent/20 to-torqx-secondary/20 rounded-xl flex items-end justify-between p-4">
                  <div className="w-4 bg-torqx-secondary rounded-t h-16"></div>
                  <div className="w-4 bg-torqx-accent rounded-t h-20"></div>
                  <div className="w-4 bg-torqx-secondary rounded-t h-12"></div>
                  <div className="w-4 bg-torqx-accent rounded-t h-24"></div>
                  <div className="w-4 bg-torqx-secondary rounded-t h-18"></div>
                  <div className="w-4 bg-torqx-accent rounded-t h-28"></div>
                  <div className="w-4 bg-torqx-secondary rounded-t h-22"></div>
                </div>
                
                {/* IA Insights */}
                <div className="mt-4 bg-torqx-primary/5 border border-torqx-primary/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-torqx-secondary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🤖</span>
                    </div>
                    <span className="font-semibold text-torqx-primary text-sm">IA Insights</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Recomendo focar em serviços de freio esta semana. 
                    Demanda 23% maior que o normal.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Elementos decorativos de fundo */}
            <div className="absolute inset-0 bg-gradient-to-br from-torqx-secondary/20 to-torqx-accent/20 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-torqx-accent/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-torqx-secondary/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
