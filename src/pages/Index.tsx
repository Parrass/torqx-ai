
import React from 'react';
import Header from '../components/Header';
import ColorPalette from '../components/ColorPalette';
import Typography from '../components/Typography';
import Buttons from '../components/Buttons';
import Cards from '../components/Cards';
import Forms from '../components/Forms';
import Tables from '../components/Tables';
import Navigation from '../components/Navigation';
import Modals from '../components/Modals';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-torqx-primary via-torqx-primary-light to-torqx-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Torqx Design System</h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Componentes, cores e padrões para criar interfaces consistentes e modernas. 
            Use este guia como referência para desenvolvimento.
          </p>
          <div className="inline-flex items-center bg-torqx-secondary/10 border border-torqx-secondary/20 rounded-full px-6 py-3">
            <span className="text-torqx-secondary-light font-medium">🎨 Design System v1.0 - Atualizado 2025</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <ColorPalette />
        <Typography />
        <Buttons />
        <Cards />
        <Forms />
        <Tables />
        <Navigation />
        <Modals />
        
        {/* Código de Exemplo */}
        <section className="component-section mb-16">
          <h2 className="text-3xl font-bold text-torqx-primary mb-8">💻 Como Usar</h2>
          
          <div className="bg-torqx-primary text-white p-8 rounded-2xl">
            <h3 className="text-xl font-semibold mb-4">Instruções para IAs</h3>
            <div className="space-y-4 text-torqx-secondary-light">
              <p>Esta página contém todos os componentes do Design System Torqx. Use como referência para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Manter consistência visual em todas as páginas</li>
                <li>Reutilizar componentes já testados e aprovados</li>
                <li>Seguir as cores e tipografia definidas</li>
                <li>Implementar estados de loading, erro e sucesso</li>
                <li>Criar formulários e tabelas padronizadas</li>
              </ul>
              <p className="mt-4 font-semibold">Sempre consulte esta página antes de criar novos componentes!</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-torqx-primary text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-torqx-secondary to-torqx-secondary-dark rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="ml-3 text-xl font-bold">Torqx Design System</span>
          </div>
          <p className="text-slate-300 mb-4">
            Criado para desenvolvedores que buscam consistência e qualidade em suas interfaces.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="text-torqx-secondary-light hover:text-white transition-colors">Documentação</a>
            <a href="#" className="text-torqx-secondary-light hover:text-white transition-colors">GitHub</a>
            <a href="#" className="text-torqx-secondary-light hover:text-white transition-colors">Figma</a>
            <a href="#" className="text-torqx-secondary-light hover:text-white transition-colors">Contato</a>
          </div>
          <div className="mt-8 pt-8 border-t border-torqx-primary-light text-sm text-slate-400">
            © 2025 Torqx Design System. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
