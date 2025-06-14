
import React from 'react';
import { Wrench } from 'lucide-react';

const TorqxFooter = () => {
  return (
    <footer className="bg-torqx-primary text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-lg flex items-center justify-center">
              <Wrench className="w-3 h-3 text-white" />
            </div>
            <span className="text-lg font-bold font-satoshi">Torqx</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <span className="text-slate-300">
              © 2025 Torqx. Todos os direitos reservados.
            </span>
            <div className="flex space-x-4">
              <a href="#" className="text-torqx-secondary-light hover:text-white transition-colors">
                Suporte
              </a>
              <a href="#" className="text-torqx-secondary-light hover:text-white transition-colors">
                Privacidade
              </a>
              <a href="#" className="text-torqx-secondary-light hover:text-white transition-colors">
                Termos
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TorqxFooter;
