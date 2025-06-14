
import React from 'react';

const Cards = () => {
  return (
    <section id="cards" className="component-section mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold text-torqx-primary mb-8">🃏 Cards</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
          <h3 className="text-lg font-semibold text-torqx-primary mb-2">Card Básico</h3>
          <p className="text-gray-600 mb-4">Descrição do card com informações relevantes para o usuário.</p>
          <button className="text-torqx-secondary font-semibold hover:text-torqx-secondary-dark">
            Saiba mais →
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-gradient-to-br from-torqx-secondary to-torqx-secondary-dark rounded-xl flex items-center justify-center mb-4">
            <span className="text-white text-xl">🚀</span>
          </div>
          <h3 className="text-lg font-semibold text-torqx-primary mb-2">Card com Ícone</h3>
          <p className="text-gray-600 mb-4">Card destacado com ícone para chamar atenção.</p>
          <button className="bg-torqx-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-torqx-secondary-dark transition-all">
            Ação
          </button>
        </div>

        <div className="bg-gradient-to-br from-torqx-primary to-torqx-primary-light text-white p-6 rounded-2xl shadow-lg">
          <div className="w-12 h-12 bg-torqx-accent rounded-xl flex items-center justify-center mb-4">
            <span className="text-white text-xl">⭐</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Card Destacado</h3>
          <p className="text-slate-300 mb-4">Card premium com background escuro para destaque especial.</p>
          <button className="bg-torqx-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-torqx-accent-dark transition-all">
            Premium
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Receita Mensal</h3>
            <span className="text-torqx-accent text-sm">+12%</span>
          </div>
          <div className="text-3xl font-bold text-torqx-primary mb-1">R$ 45.2k</div>
          <p className="text-sm text-gray-500">vs mês anterior</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-torqx-primary">Plano Pro</h3>
            <span className="bg-torqx-accent text-white px-2 py-1 rounded-full text-xs font-semibold">Popular</span>
          </div>
          <div className="text-2xl font-bold text-torqx-primary mb-1">R$ 197</div>
          <p className="text-gray-600 text-sm mb-4">/mês</p>
          <ul className="space-y-2 text-sm text-gray-600 mb-4">
            <li className="flex items-center gap-2">
              <span className="text-torqx-accent">✓</span>
              Clientes ilimitados
            </li>
            <li className="flex items-center gap-2">
              <span className="text-torqx-accent">✓</span>
              IA completa
            </li>
          </ul>
          <button className="w-full bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
            Escolher Plano
          </button>
        </div>

        <div className="bg-torqx-accent-light/10 border border-torqx-accent-light/20 p-6 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-torqx-accent rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-torqx-primary mb-1">Sucesso!</h3>
              <p className="text-gray-600 text-sm">Sua oficina foi cadastrada com sucesso.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-torqx-primary text-white p-6 rounded-xl">
        <h4 className="font-semibold mb-3">Card Básico - HTML:</h4>
        <pre className="text-sm text-torqx-secondary-light overflow-x-auto">
          <code>{`<div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
  <h3 class="text-lg font-semibold text-torqx-primary mb-2">Título</h3>
  <p class="text-gray-600 mb-4">Descrição do card</p>
  <button class="text-torqx-secondary font-semibold hover:text-torqx-secondary-dark">
    Ação →
  </button>
</div>`}</code>
        </pre>
      </div>
    </section>
  );
};

export default Cards;
