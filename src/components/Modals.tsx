
import React, { useState } from 'react';

const Modals = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <section id="modals" className="component-section mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold text-torqx-primary mb-8">🪟 Modais e Overlays</h2>
      
      {/* Botões para demonstrar modais */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          onClick={() => openModal('modal-simple')} 
          className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-6 py-3 rounded-xl font-semibold"
        >
          Modal Simples
        </button>
        <button 
          onClick={() => openModal('modal-form')} 
          className="bg-gradient-to-r from-torqx-accent to-torqx-accent-dark text-white px-6 py-3 rounded-xl font-semibold"
        >
          Modal com Formulário
        </button>
        <button 
          onClick={() => openModal('modal-confirm')} 
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Modal de Confirmação
        </button>
      </div>

      {/* Toast/Notification */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Notificações Toast</h3>
        <div className="space-y-4 max-w-md">
          {/* Toast Sucesso */}
          <div className="bg-torqx-accent text-white p-4 rounded-xl flex items-center gap-3 shadow-lg">
            <span className="text-xl">✓</span>
            <div className="flex-1">
              <div className="font-semibold">Sucesso!</div>
              <div className="text-sm opacity-90">Cliente cadastrado com sucesso.</div>
            </div>
            <button className="text-white/70 hover:text-white">×</button>
          </div>

          {/* Toast Erro */}
          <div className="bg-red-500 text-white p-4 rounded-xl flex items-center gap-3 shadow-lg">
            <span className="text-xl">⚠</span>
            <div className="flex-1">
              <div className="font-semibold">Erro!</div>
              <div className="text-sm opacity-90">Não foi possível salvar os dados.</div>
            </div>
            <button className="text-white/70 hover:text-white">×</button>
          </div>

          {/* Toast Info */}
          <div className="bg-torqx-secondary text-white p-4 rounded-xl flex items-center gap-3 shadow-lg">
            <span className="text-xl">ℹ</span>
            <div className="flex-1">
              <div className="font-semibold">Informação</div>
              <div className="text-sm opacity-90">Nova atualização disponível.</div>
            </div>
            <button className="text-white/70 hover:text-white">×</button>
          </div>
        </div>
      </div>

      {/* Loading States */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Estados de Loading</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Spinner */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
              <svg className="animate-spin h-8 w-8 text-torqx-secondary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-600">Carregando...</p>
          </div>

          {/* Skeleton */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium text-torqx-primary">Progresso</span>
              <span className="text-sm text-gray-600">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark h-2 rounded-full" style={{width: '75%'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modais */}
      {activeModal === 'modal-simple' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-torqx-primary mb-4">Modal Simples</h3>
            <p className="text-gray-600 mb-6">Este é um exemplo de modal simples com informações básicas.</p>
            <div className="flex gap-3">
              <button 
                onClick={closeModal} 
                className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-6 py-3 rounded-xl font-semibold"
              >
                Entendi
              </button>
              <button 
                onClick={closeModal} 
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'modal-form' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl p-8 max-w-lg mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-torqx-primary mb-6">Novo Cliente</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Salvar
                </button>
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'modal-confirm' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠</span>
              </div>
              <h3 className="text-xl font-bold text-torqx-primary mb-2">Confirmar Exclusão</h3>
              <p className="text-gray-600 mb-6">Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.</p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={closeModal} 
                  className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600"
                >
                  Sim, Excluir
                </button>
                <button 
                  onClick={closeModal} 
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Modals;
