
import React from 'react';

const CaseStudies = () => {
  return (
    <section id="casos" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-torqx-primary/10 rounded-full px-6 py-2 mb-6">
            <span className="text-torqx-primary font-medium">🏆 Casos de Sucesso</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-torqx-primary mb-6">
            Oficinas que já transformaram 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-torqx-secondary to-torqx-accent"> seus resultados</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja como oficinas reais aumentaram receita, reduziram custos e melhoraram 
            a satisfação dos clientes com Torqx.
          </p>
        </div>
        
        {/* Grid de Casos */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Caso 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {/* Header do caso */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-torqx-secondary to-torqx-secondary-dark rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">AS</span>
              </div>
              <div>
                <h3 className="font-bold text-torqx-primary">Auto Service Silva</h3>
                <p className="text-gray-600 text-sm">São Paulo, SP • 8 funcionários</p>
              </div>
            </div>
            
            {/* Métricas */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-torqx-accent/5 rounded-xl">
                <div className="text-2xl font-bold text-torqx-accent">+52%</div>
                <div className="text-sm text-gray-600">Receita</div>
              </div>
              <div className="text-center p-4 bg-torqx-secondary/5 rounded-xl">
                <div className="text-2xl font-bold text-torqx-secondary">-65%</div>
                <div className="text-sm text-gray-600">Tempo admin</div>
              </div>
            </div>
            
            {/* Depoimento */}
            <blockquote className="text-gray-700 italic mb-4">
              "Em 3 meses, nossa receita aumentou 52%. A IA do Torqx recomenda serviços 
              que nem pensávamos em oferecer. Nossos clientes confiam mais nas sugestões."
            </blockquote>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <div className="font-semibold text-torqx-primary text-sm">João Silva</div>
                <div className="text-gray-600 text-xs">Proprietário</div>
              </div>
            </div>
          </div>
          
          {/* Caso 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {/* Header do caso */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-torqx-accent to-torqx-accent-dark rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">MC</span>
              </div>
              <div>
                <h3 className="font-bold text-torqx-primary">Mecânica Central</h3>
                <p className="text-gray-600 text-sm">Rio de Janeiro, RJ • 12 funcionários</p>
              </div>
            </div>
            
            {/* Métricas */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-torqx-secondary/5 rounded-xl">
                <div className="text-2xl font-bold text-torqx-secondary">+38%</div>
                <div className="text-sm text-gray-600">Clientes</div>
              </div>
              <div className="text-center p-4 bg-torqx-primary/5 rounded-xl">
                <div className="text-2xl font-bold text-torqx-primary">4.9★</div>
                <div className="text-sm text-gray-600">Satisfação</div>
              </div>
            </div>
            
            {/* Depoimento */}
            <blockquote className="text-gray-700 italic mb-4">
              "O agendamento inteligente acabou com os conflitos. Nossos técnicos trabalham 
              mais focados e os clientes elogiam a organização."
            </blockquote>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <div className="font-semibold text-torqx-primary text-sm">Maria Santos</div>
                <div className="text-gray-600 text-xs">Gerente</div>
              </div>
            </div>
          </div>
          
          {/* Caso 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {/* Header do caso */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-torqx-primary to-torqx-primary-light rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">TE</span>
              </div>
              <div>
                <h3 className="font-bold text-torqx-primary">TurboExpress</h3>
                <p className="text-gray-600 text-sm">Belo Horizonte, MG • 15 funcionários</p>
              </div>
            </div>
            
            {/* Métricas */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-torqx-accent/5 rounded-xl">
                <div className="text-2xl font-bold text-torqx-accent">+45%</div>
                <div className="text-sm text-gray-600">Ticket médio</div>
              </div>
              <div className="text-center p-4 bg-torqx-secondary/5 rounded-xl">
                <div className="text-2xl font-bold text-torqx-secondary">-70%</div>
                <div className="text-sm text-gray-600">Retrabalho</div>
              </div>
            </div>
            
            {/* Depoimento */}
            <blockquote className="text-gray-700 italic mb-4">
              "A IA diagnostica problemas que nossos técnicos não viam. Reduzimos retrabalho 
              em 70% e o ticket médio subiu 45%. ROI incrível!"
            </blockquote>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <div className="font-semibold text-torqx-primary text-sm">Carlos Oliveira</div>
                <div className="text-gray-600 text-xs">Proprietário</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all">
            Quero Resultados Como Estes
          </button>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
