
import React from 'react';
import { Wrench, Mail, Phone, Clock } from 'lucide-react';

const TorqxFooter = () => {
  return (
    <footer className="bg-torqx-primary text-white py-16 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-xl flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold font-satoshi">Torqx</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Plataforma completa para gestão inteligente de oficinas automotivas.
            </p>
            <div className="text-sm text-slate-400">
              <p>&copy; 2025 Torqx. Todos os direitos reservados.</p>
            </div>
          </div>
          
          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Links Rápidos</h3>
            <ul className="space-y-3 text-slate-400">
              <li>
                <a href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/customers" className="hover:text-white transition-colors">
                  Clientes
                </a>
              </li>
              <li>
                <a href="/service-orders" className="hover:text-white transition-colors">
                  Ordens de Serviço
                </a>
              </li>
              <li>
                <a href="/reports" className="hover:text-white transition-colors">
                  Relatórios
                </a>
              </li>
            </ul>
          </div>
          
          {/* Suporte */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Suporte</h3>
            <ul className="space-y-3 text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentação
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Status do Sistema
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contato */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Contato</h3>
            <div className="space-y-3 text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-torqx-secondary" />
                <span>suporte@torqx.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-torqx-secondary" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-torqx-secondary" />
                <span>Seg-Sex 8h às 18h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TorqxFooter;
