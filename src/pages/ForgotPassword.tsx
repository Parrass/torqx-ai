
import React, { useState } from 'react';
import { Mail, ArrowLeft, Check, Wrench } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulação de envio de email - integrar com Supabase depois
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (error) {
      setError('Erro ao enviar email de recuperação');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-torqx-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-torqx-accent" />
          </div>
          <h2 className="text-2xl font-bold text-torqx-primary mb-4 font-satoshi">
            Email enviado!
          </h2>
          <p className="text-gray-600 mb-6 font-inter">
            Enviamos um link para redefinir sua senha para <strong>{email}</strong>. 
            Verifique sua caixa de entrada e spam.
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white text-sm font-medium rounded-xl hover:from-torqx-secondary-dark hover:to-torqx-accent-dark transition-all shadow-lg"
          >
            Voltar ao Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-xl flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-torqx-primary font-satoshi">Torqx</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-torqx-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-torqx-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-torqx-primary mb-2 font-satoshi">
            Esqueceu sua senha?
          </h2>
          <p className="text-gray-600 font-inter">
            Digite seu email e enviaremos um link para redefinir sua senha
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white text-sm font-medium rounded-xl hover:from-torqx-secondary-dark hover:to-torqx-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Enviar Link de Recuperação'
            )}
          </button>

          <div className="text-center">
            <a
              href="/login"
              className="inline-flex items-center text-sm font-medium text-torqx-secondary hover:text-torqx-secondary-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
