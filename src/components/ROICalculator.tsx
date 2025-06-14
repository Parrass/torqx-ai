
import React from 'react';

const ROICalculator = () => {
  return (
    <section id="roi" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo */}
          <div>
            <div className="inline-flex items-center bg-torqx-accent/10 rounded-full px-6 py-2 mb-6">
              <span className="text-torqx-accent font-medium">💰 Calcule seu ROI</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-torqx-primary mb-6">
              Veja quanto você pode 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-torqx-accent to-torqx-secondary"> economizar</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Oficinas que usam Torqx economizam em média <strong>R$ 8.500/mês</strong> 
              em custos operacionais e aumentam receita em <strong>40%</strong>.
            </p>
            
            {/* Benefícios Quantificados */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-torqx-accent/10 rounded-xl flex items-center justify-center">
                  <span className="text-torqx-accent text-xl">⏱️</span>
                </div>
                <div>
                  <div className="font-semibold text-torqx-primary">15h/semana economizadas</div>
                  <div className="text-gray-600 text-sm">Em tarefas administrativas</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-torqx-secondary/10 rounded-xl flex items-center justify-center">
                  <span className="text-torqx-secondary text-xl">📈</span>
                </div>
                <div>
                  <div className="font-semibold text-torqx-primary">40% aumento no ticket médio</div>
                  <div className="text-gray-600 text-sm">Com recomendações de IA</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-torqx-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-torqx-primary text-xl">🎯</span>
                </div>
                <div>
                  <div className="font-semibold text-torqx-primary">25% mais clientes recorrentes</div>
                  <div className="text-gray-600 text-sm">Com follow-up automatizado</div>
                </div>
              </div>
            </div>
            
            <button className="bg-gradient-to-r from-torqx-accent to-torqx-accent-dark text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all">
              Calcular Meu ROI Agora
            </button>
          </div>
          
          {/* ROI Calculator */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <h3 className="text-2xl font-bold text-torqx-primary mb-6 text-center">
              Calculadora de ROI
            </h3>
            
            {/* Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantas OS você faz por mês?
                </label>
                <input 
                  type="number" 
                  placeholder="Ex: 150" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
                  id="os-month"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ticket médio atual (R$)
                </label>
                <input 
                  type="number" 
                  placeholder="Ex: 350" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
                  id="ticket-medio"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Horas/semana em tarefas admin
                </label>
                <input 
                  type="number" 
                  placeholder="Ex: 20" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
                  id="horas-admin"
                />
              </div>
            </div>
            
            {/* Resultado */}
            <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Economia mensal estimada:</div>
                <div className="text-3xl font-bold text-torqx-accent mb-2" id="economia-mensal">
                  R$ 8.500
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Aumento de receita + redução de custos
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-torqx-secondary" id="nova-receita">
                      R$ 73.500
                    </div>
                    <div className="text-xs text-gray-600">Nova receita mensal</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-torqx-primary" id="roi-anual">
                      1.250%
                    </div>
                    <div className="text-xs text-gray-600">ROI anual</div>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all">
              Começar Teste Gratuito
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;
