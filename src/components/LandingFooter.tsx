
import React from 'react';

const LandingFooter = () => {
  return (
    <footer className="bg-torqx-primary text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-torqx-secondary to-torqx-secondary-dark rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="ml-3 text-2xl font-bold">Torqx</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              A força que move sua oficina. Plataforma completa com IA nativa 
              para gestão inteligente de oficinas automotivas.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zm4.624 7.512l-2.082 9.748c-.153.718-.559 1.005-1.134.623l-3.134-2.314-1.512 1.455c-.168.168-.308.308-.632.308l.226-3.2 5.856-5.292c.254-.226-.055-.353-.395-.127L8.364 12.05l-3.107-.971c-.675-.211-.688-.675.141-.999l12.132-4.677c.561-.204 1.055.135.871.999z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Links Produto */}
          <div>
            <h3 className="font-semibold mb-4">Produto</h3>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
            </ul>
          </div>
          
          {/* Links Empresa */}
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
          
          {/* Links Suporte */}
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
          <p>&copy; 2025 Torqx. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
