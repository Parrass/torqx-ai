
import React, { useState } from 'react';

const Forms = () => {
  const [formData, setFormData] = useState({
    oficina: '',
    email: '',
    cnpj: '00.000.000/0001-91',
    telefone: '(11) 99999-9999',
    descricao: '',
    especialidade: '',
    termos: false,
    newsletter: true,
    tipo: 'independente',
    cpf: '' // Adicionando a propriedade cpf que estava faltando
  });

  // Função para aplicar máscara de CNPJ
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  // Função para aplicar máscara de telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        return numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
      } else {
        return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      }
    }
    return value;
  };

  // Função para aplicar máscara de CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }
    return value;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let formattedValue = value;
    
    // Aplicar máscaras específicas
    if (name === 'cnpj') {
      formattedValue = formatCNPJ(value);
    } else if (name === 'telefone') {
      formattedValue = formatPhone(value);
    } else if (name === 'cpf') {
      formattedValue = formatCPF(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : formattedValue
    }));
  };

  return (
    <section id="forms" className="component-section mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold text-torqx-primary mb-8">📝 Formulários</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Inputs</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Oficina</label>
              <input 
                type="text" 
                name="oficina"
                placeholder="Digite o nome da oficina" 
                value={formData.oficina}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  name="email"
                  placeholder="seu@email.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">📧</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
              <input 
                type="text" 
                name="cnpj"
                placeholder="00.000.000/0000-00" 
                value={formData.cnpj}
                onChange={handleInputChange}
                maxLength={18}
                className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              <p className="text-red-500 text-sm mt-1">CNPJ inválido</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
              <input 
                type="text" 
                name="telefone"
                placeholder="(11) 99999-9999" 
                value={formData.telefone}
                onChange={handleInputChange}
                maxLength={15}
                className="w-full px-4 py-3 border-2 border-torqx-accent rounded-xl focus:ring-2 focus:ring-torqx-accent focus:border-transparent transition-all"
              />
              <p className="text-torqx-accent text-sm mt-1">✓ Telefone válido</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
              <input 
                type="text" 
                name="cpf"
                placeholder="000.000.000-00" 
                value={formData.cpf || ''}
                onChange={handleInputChange}
                maxLength={14}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Outros Elementos</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <textarea 
                name="descricao"
                placeholder="Descreva sua oficina..." 
                rows={4}
                value={formData.descricao}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Especialidade</label>
              <select 
                name="especialidade"
                value={formData.especialidade}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
              >
                <option value="">Selecione uma especialidade</option>
                <option value="mecanica">Mecânica Geral</option>
                <option value="eletrica">Elétrica Automotiva</option>
                <option value="funilaria">Funilaria e Pintura</option>
                <option value="ar-condicionado">Ar Condicionado</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  name="termos"
                  checked={formData.termos}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-torqx-secondary border-gray-300 rounded focus:ring-torqx-secondary"
                />
                <span className="text-gray-700">Aceito os termos de uso</span>
              </label>
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-torqx-secondary border-gray-300 rounded focus:ring-torqx-secondary"
                />
                <span className="text-gray-700">Quero receber novidades por email</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Oficina</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="tipo" 
                    value="independente" 
                    checked={formData.tipo === 'independente'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-torqx-secondary border-gray-300 focus:ring-torqx-secondary"
                  />
                  <span className="text-gray-700">Independente</span>
                </label>
                <label className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="tipo" 
                    value="rede" 
                    checked={formData.tipo === 'rede'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-torqx-secondary border-gray-300 focus:ring-torqx-secondary"
                  />
                  <span className="text-gray-700">Rede/Franquia</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário Completo */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Formulário Completo</h3>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-torqx-primary mb-6">Cadastrar Oficina</h4>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Oficina *</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input 
                type="email" 
                required 
                placeholder="contato@oficina.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
              <input 
                type="text" 
                required 
                placeholder="(11) 99999-9999"
                maxLength={15}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                required 
                className="w-5 h-5 text-torqx-secondary border-gray-300 rounded focus:ring-torqx-secondary"
              />
              <span className="text-gray-700">
                Aceito os <a href="#" className="text-torqx-secondary hover:underline">termos de uso</a> e <a href="#" className="text-torqx-secondary hover:underline">política de privacidade</a>
              </span>
            </div>

            <div className="flex gap-4">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Cadastrar Oficina
              </button>
              <button 
                type="button" 
                className="bg-white text-torqx-primary px-8 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-torqx-secondary transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Forms;
