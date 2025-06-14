
import React, { useState } from 'react';

const LandingHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-torqx-secondary to-torqx-secondary-dark rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg font-sans">T</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-torqx-primary font-sans">Torqx</span>
          </div>
          
          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-8">
            <a href="#solucao" className="text-gray-600 hover:text-torqx-primary font-medium transition-colors">Solução</a>
            <a href="#roi" className="text-gray-600 hover:text-torqx-primary font-medium transition-colors">ROI</a>
            <a href="#casos" className="text-gray-600 hover:text-torqx-primary font-medium transition-colors">Casos de Sucesso</a>
            <a href="#precos" className="text-gray-600 hover:text-torqx-primary font-medium transition-colors">Preços</a>
          </div>
          
          {/* CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="/login" 
              className="text-torqx-primary hover:text-torqx-secondary font-semibold transition-colors"
            >
              Entrar
            </a>
            <a
              href="/register"
              className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Criar Conta
            </a>
          </div>
          
          {/* Menu Mobile (Hamburger) */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-torqx-primary"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 pt-4 mt-4">
            <div className="space-y-2">
              <a href="#solucao" className="block py-2 text-gray-600 hover:text-torqx-primary">Solução</a>
              <a href="#roi" className="block py-2 text-gray-600 hover:text-torqx-primary">ROI</a>
              <a href="#casos" className="block py-2 text-gray-600 hover:text-torqx-primary">Casos de Sucesso</a>
              <a href="#precos" className="block py-2 text-gray-600 hover:text-torqx-primary">Preços</a>
              <div className="pt-4 space-y-2">
                <a href="/login" className="block w-full text-left py-2 text-torqx-primary font-semibold">Entrar</a>
                <a 
                  href="/register"
                  className="block w-full bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-6 py-3 rounded-xl font-semibold text-center"
                >
                  Criar Conta
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default LandingHeader;
