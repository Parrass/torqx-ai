
import React, { useState } from 'react';

const Buttons = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <section id="buttons" className="component-section mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold text-torqx-primary mb-8">🔘 Botões</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Primários</h3>
          <div className="space-y-4">
            <div>
              <button className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Botão Primário
              </button>
              <div className="mt-2">
                <code className="text-sm text-gray-600">bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all</code>
              </div>
            </div>

            <div>
              <button className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all">
                Botão Primário Large
              </button>
              <div className="mt-2">
                <code className="text-sm text-gray-600">px-8 py-4 text-lg</code>
              </div>
            </div>

            <div>
              <button className="bg-gradient-to-r from-torqx-accent to-torqx-accent-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Botão Accent
              </button>
              <div className="mt-2">
                <code className="text-sm text-gray-600">bg-gradient-to-r from-torqx-accent to-torqx-accent-dark</code>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Secundários</h3>
          <div className="space-y-4">
            <div>
              <button className="bg-white text-torqx-primary px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-torqx-secondary hover:text-torqx-secondary transition-all">
                Botão Secundário
              </button>
              <div className="mt-2">
                <code className="text-sm text-gray-600">bg-white text-torqx-primary border-2 border-gray-200 hover:border-torqx-secondary</code>
              </div>
            </div>

            <div>
              <button className="bg-transparent text-torqx-secondary px-6 py-3 rounded-xl font-semibold border-2 border-torqx-secondary hover:bg-torqx-secondary hover:text-white transition-all">
                Botão Outline
              </button>
              <div className="mt-2">
                <code className="text-sm text-gray-600">bg-transparent text-torqx-secondary border-2 border-torqx-secondary hover:bg-torqx-secondary hover:text-white</code>
              </div>
            </div>

            <div>
              <button className="bg-transparent text-torqx-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                Botão Ghost
              </button>
              <div className="mt-2">
                <code className="text-sm text-gray-600">bg-transparent text-torqx-primary hover:bg-gray-100</code>
              </div>
            </div>

            <div>
              <button className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
                Botão Small
              </button>
              <div className="mt-2">
                <code className="text-sm text-gray-600">px-4 py-2 rounded-lg text-sm</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Estados</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-6 py-3 rounded-xl font-semibold">
            Normal
          </button>
          <button className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-6 py-3 rounded-xl font-semibold opacity-75 cursor-not-allowed" disabled>
            Disabled
          </button>
          <button 
            onClick={handleLoadingClick}
            className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Loading' : 'Click to Load'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Buttons;
