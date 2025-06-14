
import React from 'react';

const PricingSection = () => {
  return (
    <section id="precos" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-torqx-accent/10 rounded-full px-6 py-2 mb-6">
            <span className="text-torqx-accent font-medium">💎 Planos e Preços</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-torqx-primary mb-6">
            Escolha o plano ideal para 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-torqx-secondary to-torqx-accent"> sua oficina</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Todos os planos incluem IA nativa, suporte especializado e 30 dias de teste gratuito. 
            Sem taxa de setup, sem fidelidade.
          </p>
        </div>
        
        {/* Grid de Planos */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Plano Starter */}
          <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-torqx-secondary/30 transition-all">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-torqx-primary mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">Ideal para oficinas pequenas</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-torqx-primary">R$ 97</span>
                <span className="text-gray-600">/mês</span>
              </div>
              
              <div className="text-sm text-gray-600">
                Até 3 usuários • Até 100 OS/mês
              </div>
            </div>
            
            {/* Features */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent text-lg">✓</span>
                <span className="text-gray-700">Gestão de clientes e veículos</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent text-lg">✓</span>
                <span className="text-gray-700">Ordens de serviço básicas</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent text-lg">✓</span>
                <span className="text-gray-700">IA para diagnóstico</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent text-lg">✓</span>
                <span className="text-gray-700">Agendamento simples</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent text-lg">✓</span>
                <span className="text-gray-700">Relatórios básicos</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent text-lg">✓</span>
                <span className="text-gray-700">Suporte por email</span>
              </li>
            </ul>
            
            <button className="w-full bg-white text-torqx-primary py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-torqx-secondary hover:text-torqx-secondary transition-all">
              Começar Teste Gratuito
            </button>
          </div>
          
          {/* Plano Professional (Destacado) */}
          <div className="bg-gradient-to-br from-torqx-secondary to-torqx-secondary-dark p-8 rounded-2xl text-white relative transform lg:scale-105 shadow-xl">
            {/* Badge Popular */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-torqx-accent text-white px-6 py-2 rounded-full text-sm font-semibold">
                🔥 Mais Popular
              </span>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-torqx-secondary-light mb-6">Para oficinas em crescimento</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold">R$ 197</span>
                <span className="text-torqx-secondary-light">/mês</span>
              </div>
              
              <div className="text-sm text-torqx-secondary-light">
                Até 10 usuários • OS ilimitadas
              </div>
            </div>
            
            {/* Features */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent-light text-lg">✓</span>
                <span>Tudo do plano Starter</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent-light text-lg">✓</span>
                <span>IA avançada + recomendações</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent-light text-lg">✓</span>
                <span>Agendamento inteligente</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent-light text-lg">✓</span>
                <span>Gestão de estoque</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent-light text-lg">✓</span>
                <span>Chatbot WhatsApp</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent-light text-lg">✓</span>
                <span>Analytics avançados</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent-light text-lg">✓</span>
                <span>Suporte prioritário</span>
              </li>
            </ul>
            
            <button className="w-full bg-white text-torqx-secondary py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all">
              Começar Teste Gratuito
            </button>
          </div>
          
          {/* Plano Enterprise */}
          <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-torqx-primary/30 transition-all">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-torqx-primary mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">Para redes e oficinas grandes</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-torqx-primary">R$ 397</span>
                <span className="text-gray-600">/mês</span>
              </div>
              
              <div className="text-sm text-gray-600">
                Usuários ilimitados • Multi-filiais
              </div>
            </div>
            
            {/* Features */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent text-lg">✓</span>
                <span className="text-gray-700">Tudo do plano Professional</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent text-lg">✓</span>
                <span className="text-gray-700">Multi-filiais</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent text-lg">✓</span>
                <span className="text-gray-700">API personalizada</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent text-lg">✓</span>
                <span className="text-gray-700">Integrações customizadas</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent text-lg">✓</span>
                <span className="text-gray-700">Treinamento personalizado</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-torqx-accent text-lg">✓</span>
                <span className="text-gray-700">Gerente de conta dedicado</span>
              </li>
            </ul>
            
            <button className="w-full bg-gradient-to-r from-torqx-primary to-torqx-primary-light text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all">
              Falar com Especialista
            </button>
          </div>
        </div>
        
        {/* Garantias */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <span className="text-torqx-accent text-2xl">🛡️</span>
              <span className="text-gray-700">30 dias grátis</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-torqx-secondary text-2xl">💳</span>
              <span className="text-gray-700">Sem cartão de crédito</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-torqx-primary text-2xl">🚀</span>
              <span className="text-gray-700">Setup em 5 minutos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
