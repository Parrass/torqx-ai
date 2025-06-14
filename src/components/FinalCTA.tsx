
import React from 'react';

const FinalCTA = () => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-torqx-primary via-torqx-primary-light to-torqx-primary text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          Pronto para transformar sua oficina com 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-torqx-secondary-light to-torqx-accent-light">
            {' '}IA?
          </span>
        </h2>
        
        <p className="text-xl text-slate-300 mb-10 leading-relaxed">
          Junte-se a centenas de oficinas que já aumentaram receita em 40% 
          e reduziram tempo administrativo em 60% com Torqx.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all">
            Começar Teste Gratuito - 30 Dias
          </button>
          <button className="bg-white/10 backdrop-blur text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all">
            Agendar Demo Personalizada
          </button>
        </div>
        
        {/* Garantias */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-torqx-accent">✓</span>
            <span>Sem cartão de crédito</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-torqx-accent">✓</span>
            <span>Setup em 5 minutos</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-torqx-accent">✓</span>
            <span>Suporte especializado</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
