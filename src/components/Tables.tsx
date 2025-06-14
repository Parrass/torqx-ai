
import React from 'react';

const Tables = () => {
  const tableData = [
    { id: 1, cliente: 'João Silva', veiculo: 'Civic 2020', servico: 'Revisão', valor: 'R$ 450,00', status: 'Concluído' },
    { id: 2, cliente: 'Maria Santos', veiculo: 'Corolla 2019', servico: 'Troca de óleo', valor: 'R$ 120,00', status: 'Em andamento' },
    { id: 3, cliente: 'Pedro Costa', veiculo: 'Golf 2021', servico: 'Alinhamento', valor: 'R$ 80,00', status: 'Aguardando' },
    { id: 4, cliente: 'Ana Lima', veiculo: 'Onix 2022', servico: 'Freios', valor: 'R$ 320,00', status: 'Concluído' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído':
        return 'bg-torqx-accent text-white';
      case 'Em andamento':
        return 'bg-torqx-secondary text-white';
      case 'Aguardando':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <section id="tables" className="component-section mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold text-torqx-primary mb-8">📊 Tabelas</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Tabela Básica</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-torqx-primary">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-torqx-primary">Cliente</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-torqx-primary">Veículo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-torqx-primary">Serviço</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-torqx-primary">Valor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-torqx-primary">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-torqx-primary">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tableData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">#{row.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-torqx-primary">{row.cliente}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{row.veiculo}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{row.servico}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-torqx-primary">{row.valor}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="text-torqx-secondary hover:text-torqx-secondary-dark text-sm font-medium">
                            Ver
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
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
      </div>
    </section>
  );
};

export default Tables;
