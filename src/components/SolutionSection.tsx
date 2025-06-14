
import React from 'react';

const SolutionSection = () => {
  return (
    <section id="solucao" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header da Seção */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-torqx-secondary/10 rounded-full px-6 py-2 mb-6">
            <span className="text-torqx-secondary font-medium">✨ Solução Completa</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-torqx-primary mb-6">
            Tudo que sua oficina precisa para 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-torqx-secondary to-torqx-accent"> crescer</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Plataforma completa que integra gestão, IA e automação para transformar 
            sua oficina em um negócio mais eficiente e lucrativo.
          </p>
        </div>
        
        {/* Cards dos 3 Pilares */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pilar 1: IA para Diagnóstico */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
            {/* Ícone */}
            <div className="w-16 h-16 bg-gradient-to-br from-torqx-secondary to-torqx-secondary-dark rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            
            {/* Conteúdo */}
            <h3 className="text-2xl font-bold text-torqx-primary mb-4">
              Diagnóstico Inteligente
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Cliente descreve problema → IA analisa → Sugere serviços e peças automaticamente. 
              <strong> 95% de precisão</strong>, <strong>70% menos tempo</strong> para criar orçamentos.
            </p>
            
            {/* Exemplo Prático */}
            <div className="bg-torqx-secondary/5 border border-torqx-secondary/10 rounded-xl p-4 mb-6">
              <div className="text-sm font-semibold text-torqx-secondary mb-2">💡 Exemplo Real:</div>
              <div className="text-sm text-gray-700">
                <strong>Cliente:</strong> "Meu carro está fazendo barulho no freio"<br/>
                <strong>IA sugere:</strong> Pastilhas + discos + fluido → <strong>R$ 450</strong>
              </div>
            </div>
            
            {/* Benefícios */}
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-torqx-accent">✓</span>
                Orçamentos 70% mais rápidos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-torqx-accent">✓</span>
                95% precisão nas recomendações
              </li>
              <li className="flex items-center gap-2">
                <span className="text-torqx-accent">✓</span>
                Ticket médio 40% maior
              </li>
            </ul>
          </div>
          
          {/* Pilar 2: Gestão Automatizada */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
            {/* Ícone */}
            <div className="w-16 h-16 bg-gradient-to-br from-torqx-accent to-torqx-accent-dark rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            
            {/* Conteúdo */}
            <h3 className="text-2xl font-bold text-torqx-primary mb-4">
              Automação Completa
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Agenda otimizada, estoque inteligente, follow-up automático. 
              <strong> 60% menos tempo</strong> em tarefas administrativas para focar no que importa.
            </p>
            
            {/* Exemplo Prático */}
            <div className="bg-torqx-accent/5 border border-torqx-accent/10 rounded-xl p-4 mb-6">
              <div className="text-sm font-semibold text-torqx-accent mb-2">⚡ Automações:</div>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• Agendamento otimizado por especialidade</div>
                <div>• Alertas de estoque automáticos</div>
                <div>• Follow-up pós-serviço por WhatsApp</div>
              </div>
            </div>
            
            {/* Benefícios */}
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-torqx-accent">✓</span>
                60% menos tempo administrativo
              </li>
              <li className="flex items-center gap-2">
                <span className="text-torqx-accent">✓</span>
                Zero conflitos de agendamento
              </li>
              <li className="flex items-center gap-2">
                <span className="text-torqx-accent">✓</span>
                Estoque sempre otimizado
              </li>
            </ul>
          </div>
          
          {/* Pilar 3: Crescimento Acelerado */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
            {/* Ícone */}
            <div className="w-16 h-16 bg-gradient-to-br from-torqx-primary to-torqx-primary-light rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
            </div>
            
            {/* Conteúdo */}
            <h3 className="text-2xl font-bold text-torqx-primary mb-4">
              Insights de Negócio
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Analytics avançados, manutenção preditiva e insights de IA para decisões 
              estratégicas que <strong>aumentam receita em 40%</strong>.
            </p>
            
            {/* Exemplo Prático */}
            <div className="bg-torqx-primary/5 border border-torqx-primary/10 rounded-xl p-4 mb-6">
              <div className="text-sm font-semibold text-torqx-primary mb-2">📊 IA Insights:</div>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• Previsão de demanda por serviços</div>
                <div>• Clientes em risco de churn</div>
                <div>• Oportunidades de upsell</div>
              </div>
            </div>
            
            {/* Benefícios */}
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-torqx-accent">✓</span>
                40% aumento na receita
              </li>
              <li className="flex items-center gap-2">
                <span className="text-torqx-accent">✓</span>
                25% mais clientes recorrentes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-torqx-accent">✓</span>
                Decisões baseadas em dados
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
