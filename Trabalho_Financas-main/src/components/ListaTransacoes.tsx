import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Edit3, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

export interface Transacao {
  id: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  categoria: string;
  data: Timestamp;
  usuarioId: string;
}

interface Props {
  transacoes: Transacao[];
  carregando: boolean;
  onEditar: (transacao: Transacao) => void;
  onExcluir: (id: string, descricao: string) => Promise<boolean>;
}

const ListaTransacoes = ({ transacoes, carregando, onEditar, onExcluir }: Props) => {
  const [filtros, setFiltros] = useState({
    tipo: 'todos',
    categoria: 'todas',
    busca: '',
    dataUnica: ''
  });

  const categorias = [
    { value: 'todas', label: 'Todas as categorias' },
    { value: 'alimentacao', label: 'Alimentação' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'moradia', label: 'Moradia' },
    { value: 'saude', label: 'Saúde' },
    { value: 'educacao', label: 'Educação' },
    { value: 'lazer', label: 'Lazer' },
    { value: 'trabalho', label: 'Trabalho' },
    { value: 'outros', label: 'Outros' }
  ];

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: Timestamp) => {
    return new Date(data.seconds * 1000).toLocaleDateString('pt-BR');
  };

  const obterLabelCategoria = (categoria: string) => {
    const cat = categorias.find(c => c.value === categoria);
    return cat ? cat.label : categoria;
  };

  const limparFiltros = () => {
    setFiltros({
      tipo: 'todos',
      categoria: 'todas',
      busca: '',
      dataUnica: ''
    });
  };

  const transacoesFiltradas = transacoes.filter(transacao => {
    const matchTipo = filtros.tipo === 'todos' || transacao.tipo === filtros.tipo;
    const matchCategoria = filtros.categoria === 'todas' || transacao.categoria === filtros.categoria;
    const matchBusca = filtros.busca === '' ||
      transacao.descricao.toLowerCase().includes(filtros.busca.toLowerCase());
    const matchDataUnica =
      filtros.dataUnica === '' ||
      (() => {
        const dataInput = new Date(filtros.dataUnica);
        const dataTransacao = new Date(transacao.data.seconds * 1000);
        return (
          dataTransacao.getFullYear() === dataInput.getFullYear() &&
          dataTransacao.getMonth() === dataInput.getMonth() &&
          dataTransacao.getDate() === dataInput.getDate()
        );
      })();

    return matchTipo && matchCategoria && matchBusca && matchDataUnica;
  });

  if (carregando) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Suas Transações</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-6 h-6 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Suas Transações</h2>
      </div>

      <motion.div 
        className="mb-6 p-4 bg-gray-50 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
              className="input-field"
            >
              <option value="todos">Todos</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              value={filtros.categoria}
              onChange={(e) => setFiltros(prev => ({ ...prev, categoria: e.target.value }))}
              className="input-field"
            >
              {categorias.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Search className="w-4 h-4" /> Buscar
            </label>
            <input
              type="text"
              value={filtros.busca}
              onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
              className="input-field"
              placeholder="Buscar por descrição..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input
              type="date"
              value={filtros.dataUnica}
              onChange={(e) => setFiltros(prev => ({ ...prev, dataUnica: e.target.value }))}
              className="input-field"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={limparFiltros}
            className="btn-secondary flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Limpar Filtros
          </button>
        </div>
      </motion.div>

      {transacoesFiltradas.length === 0 ? (
        <motion.div 
          className="text-center py-12 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium">Nenhuma transação encontrada</p>
          <p className="text-sm">Adicione uma nova transação ou ajuste os filtros</p>
        </motion.div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
          <AnimatePresence>
            {transacoesFiltradas.map((transacao, index) => (
              <motion.div
                key={transacao.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 group flex-col sm:flex-row gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    {transacao.tipo === 'receita' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <h3 className="font-medium text-gray-800 group-hover:text-gray-900 truncate max-w-[200px] sm:max-w-full">
                      {transacao.descricao}
                    </h3>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {obterLabelCategoria(transacao.categoria)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 ml-7">{formatarData(transacao.data)}</p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end sm:items-center w-full sm:w-auto">
                  <span className={`font-semibold text-lg ${
                    transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transacao.tipo === 'receita' ? '+' : '-'} {formatarMoeda(transacao.valor)}
                  </span>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditar(transacao)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onExcluir(transacao.id, transacao.descricao)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default ListaTransacoes;
