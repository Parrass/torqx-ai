
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Wrench } from 'lucide-react';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validação básica
    const newErrors: FormErrors = {};
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      // Simulação de login - integrar com Supabase depois
      await new Promise(resolve => setTimeout(resolve, 1500));
      window.location.href = '/dashboard';
    } catch (error) {
      setErrors({ general: 'Erro ao fazer login' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Lado esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-xl flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-torqx-primary font-satoshi">Torqx</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-torqx-primary font-satoshi">
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-gray-600 font-inter">
              Faça login para acessar sua oficina
            </p>
          </div>

          {/* Formulário */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      if (errors.email) setErrors({...errors, email: undefined});
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className={`block w-full pl-10 pr-10 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({...formData, password: e.target.value});
                      if (errors.password) setErrors({...errors, password: undefined});
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Lembrar e Esqueci senha */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-torqx-secondary focus:ring-torqx-secondary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-torqx-secondary hover:text-torqx-secondary-dark transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            {/* Botão de Login */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-torqx-secondary to-torqx-accent hover:from-torqx-secondary-dark hover:to-torqx-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-torqx-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Link para registro */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <a href="/register" className="font-medium text-torqx-secondary hover:text-torqx-secondary-dark transition-colors">
                  Cadastre-se grátis
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Lado direito - Imagem (hidden em mobile) */}
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-torqx-primary/90 to-torqx-secondary/90"></div>
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1486754735734-325b5831c3ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Oficina moderna"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h3 className="text-3xl font-bold mb-4 font-satoshi">
              Gerencie sua oficina com inteligência
            </h3>
            <p className="text-xl opacity-90 mb-8 font-inter">
              IA integrada para diagnósticos precisos e gestão eficiente
            </p>
            <div className="grid grid-cols-1 gap-4 text-left max-w-md">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-torqx-accent rounded-full"></div>
                <span>Diagnóstico automático com IA</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-torqx-accent rounded-full"></div>
                <span>Gestão completa de clientes e veículos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-torqx-accent rounded-full"></div>
                <span>Controle de estoque inteligente</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-torqx-accent rounded-full"></div>
                <span>Relatórios e insights em tempo real</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
