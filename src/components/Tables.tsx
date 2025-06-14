
import React from 'react';

const Tables = () => {
  const tableData = [
    { id: 1, cliente: 'João Silva', email: 'joao@email.com', veiculo: 'Honda Civic', ano: '2020', placa: 'ABC-1234', servico: 'Troca de óleo', valor: 'R$ 150,00', status: 'Concluído', data: '14/06/2025' },
    { id: 2, cliente: 'Maria Santos', email: 'maria@email.com', veiculo: 'Toyota Corolla', ano: '2019', placa: 'XYZ-5678', servico: 'Revisão completa', valor: 'R$ 450,00', status: 'Em andamento', data: '14/06/2025' },
    { id: 3, cliente: 'Carlos Oliveira', email: 'carlos@email.com', veiculo: 'Ford Focus', ano: '2021', placa: 'DEF-9012', servico: 'Troca de pastilhas', valor: 'R$ 280,00', status: 'Aguardando', data: '14/06/2025' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído':
        return 'bg-torqx-accent/10 text-torqx-accent';
      case 'Em andamento':
        return 'bg-torqx-secondary/10 text-torqx-secondary';
      case 'Aguardando':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="tables" className="component-section mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold text-torqx-primary mb-8">📊 Tabelas</h2>
      
      {/* Tabela Simples */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Tabela Simples</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Veículo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Serviço</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-torqx-primary">{row.cliente}</div>
                    <div className="text-sm text-gray-600">{row.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{row.veiculo}</div>
                    <div className="text-sm text-gray-600">{row.ano} • {row.placa}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{row.servico}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-torqx-primary">{row.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabela com Ações */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Tabela com Ações</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h4 className="font-semibold text-torqx-primary">Ordens de Serviço</h4>
            <button className="bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold">
              Nova OS
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">OS #</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Data</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Valor</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableData.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-torqx-secondary">#{String(index + 1).padStart(6, '0')}</td>
                  <td className="px-6 py-4 font-medium text-torqx-primary">{row.cliente}</td>
                  <td className="px-6 py-4 text-gray-600">{row.data}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-torqx-primary">{row.valor}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="text-torqx-secondary hover:text-torqx-secondary-dark text-sm">Ver</button>
                      <button className="text-gray-600 hover:text-gray-800 text-sm">Editar</button>
                      <button className="text-red-600 hover:text-red-800 text-sm">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabela com Cards (Mobile-First) */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Tabela com Cards (Mobile-First)</h3>
        <div className="grid gap-4 md:hidden">
          {tableData.map((row) => (
            <div key={row.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-torqx-primary">{row.cliente}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
                  {row.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Veículo:</span>
                  <span className="text-gray-700">{row.veiculo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Serviço:</span>
                  <span className="text-gray-700">{row.servico}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-semibold text-torqx-primary">{row.valor}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="bg-torqx-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-torqx-secondary-dark transition-all">
                  Ver Detalhes
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all">
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Badges */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Status Badges</h3>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-torqx-accent/10 text-torqx-accent">
            Concluído
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-torqx-secondary/10 text-torqx-secondary">
            Em andamento
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Aguardando
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelado
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Rascunho
          </span>
        </div>
      </div>
    </section>
  );
};

export default Tables;
