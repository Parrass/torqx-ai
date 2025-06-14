
import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, Building, User, Wrench } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Dados da oficina
    workshopName: '',
    businessName: '',
    documentNumber: '',
    phone: '',
    // Dados do usuário
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já está logado
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  const steps = [
    { id: 1, title: 'Dados da Oficina', icon: Building },
    { id: 2, title: 'Seu Perfil', icon: User },
    { id: 3, title: 'Confirmação', icon: Check }
  ];

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const validateStep = (step: number) => {
    const newErrors: any = {};
    
    if (step === 1) {
      if (!formData.workshopName) newErrors.workshopName = 'Nome da oficina é obrigatório';
      if (!formData.documentNumber) newErrors.documentNumber = 'CNPJ é obrigatório';
      if (!formData.phone) newErrors.phone = 'Telefone é obrigatório';
    }
    
    if (step === 2) {
      if (!formData.fullName) newErrors.fullName = 'Nome completo é obrigatório';
      if (!formData.email) newErrors.email = 'Email é obrigatório';
      if (!formData.password) newErrors.password = 'Senha é obrigatória';
      if (formData.password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Primeiro, criar o tenant (oficina)
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          company_name: formData.workshopName,
          cnpj: formData.documentNumber,
          phone: formData.phone,
          email: formData.email,
          subdomain: formData.workshopName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        })
        .select()
        .single();

      if (tenantError) {
        throw tenantError;
      }

      // Registrar o usuário com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: formData.fullName,
            tenant_id: tenantData.id,
            role: 'owner'
          }
        }
      });

      if (authError) {
        // Se houver erro no registro do usuário, deletar o tenant criado
        await supabase.from('tenants').delete().eq('id', tenantData.id);
        throw authError;
      }

      // Se chegou até aqui, o registro foi bem-sucedido
      if (authData.user && !authData.session) {
        // Usuário precisa confirmar email
        alert('Cadastro realizado com sucesso! Por favor, verifique seu email para confirmar a conta.');
        navigate('/login');
      } else {
        // Login automático
        navigate('/dashboard');
      }

    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      if (error.message.includes('User already registered')) {
        setErrors({ general: 'Este email já está cadastrado. Tente fazer login.' });
      } else if (error.message.includes('Password should be at least 6 characters')) {
        setErrors({ password: 'A senha deve ter pelo menos 6 caracteres' });
      } else if (error.message.includes('Invalid email')) {
        setErrors({ email: 'Email inválido' });
      } else {
        setErrors({ general: error.message || 'Erro ao criar conta. Tente novamente.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-xl flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-torqx-primary font-satoshi">Torqx</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-torqx-primary font-satoshi">
            Crie sua conta grátis
          </h1>
          <p className="mt-2 text-gray-600 font-inter">
            Configure sua oficina em poucos minutos
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  currentStep >= step.id 
                    ? 'bg-torqx-secondary border-torqx-secondary text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-torqx-secondary' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-torqx-secondary' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Step 1: Dados da Oficina */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-torqx-primary mb-4 font-satoshi">
                  Informações da Oficina
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Oficina *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
                    placeholder="Auto Service Silva"
                    value={formData.workshopName}
                    onChange={(e) => setFormData({...formData, workshopName: e.target.value})}
                  />
                  {errors.workshopName && <p className="mt-1 text-sm text-red-600">{errors.workshopName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
                    placeholder="00.000.000/0000-00"
                    value={formData.documentNumber}
                    onChange={(e) => setFormData({...formData, documentNumber: e.target.value})}
                  />
                  {errors.documentNumber && <p className="mt-1 text-sm text-red-600">{errors.documentNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dados do Usuário */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-torqx-primary mb-4 font-satoshi">
                  Seus Dados
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
                    placeholder="João Silva"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                  {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
                    placeholder="joao@autoservice.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha *
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Senha *
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
                      placeholder="Repita a senha"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmação */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-torqx-primary mb-4 font-satoshi">
                  Confirme seus dados
                </h3>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Oficina</h4>
                  <p className="text-gray-600">{formData.workshopName}</p>
                  <p className="text-sm text-gray-500">{formData.documentNumber}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Responsável</h4>
                  <p className="text-gray-600">{formData.fullName}</p>
                  <p className="text-sm text-gray-500">{formData.email}</p>
                </div>
              </div>

              <div className="bg-torqx-secondary/10 border border-torqx-secondary/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-torqx-secondary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-torqx-secondary">
                      Teste grátis por 30 dias
                    </p>
                    <p className="text-sm text-gray-600">
                      Sem cartão de crédito. Cancele quando quiser.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrev}
              className={`flex items-center px-6 py-3 text-sm font-medium rounded-xl transition-all ${
                currentStep === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:text-torqx-primary hover:bg-gray-50'
              }`}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white text-sm font-medium rounded-xl hover:from-torqx-secondary-dark hover:to-torqx-accent-dark transition-all shadow-lg"
              >
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white text-sm font-medium rounded-xl hover:from-torqx-secondary-dark hover:to-torqx-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Criar Conta
              </button>
            )}
          </div>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <a href="/login" className="font-medium text-torqx-secondary hover:text-torqx-secondary-dark transition-colors">
                Faça login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
