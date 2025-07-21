import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Save, X, Plus, Edit3 } from 'lucide-react';
import { Transacao } from '../hooks/useTransacoes';

interface Props {
  transacaoEditando?: Transacao | null;
  onSalvar: (dados: Omit<Transacao, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  onEditar: (id: string, dados: Partial<Transacao>) => Promise<boolean>;
  onCancelar?: () => void;
}

const FormularioTransacao = ({ transacaoEditando, onSalvar, onEditar, onCancelar }: Props) => {
  const [formData, setFormData] = useState({
    tipo: transacaoEditando?.tipo || 'receita',
    descricao: transacaoEditando?.descricao || '',
    valor: transacaoEditando?.valor?.toString() || '',
    categoria: transacaoEditando?.categoria || 'alimentacao',
    data: transacaoEditando?.data
      ? new Date(transacaoEditando.data.seconds * 1000).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  });
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (transacaoEditando) {
      setFormData({
        tipo: transacaoEditando.tipo,
        descricao: transacaoEditando.descricao,
        valor: transacaoEditando.valor.toString(),
        categoria: transacaoEditando.categoria,
        data: new Date(transacaoEditando.data.seconds * 1000).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        tipo: 'despesa',
        descricao: '',
        valor: '',
        categoria: 'alimentacao',
        data: new Date().toISOString().split('T')[0]
      });
    }
  }, [transacaoEditando]);

  const categorias = [
    { value: 'alimentacao', label: 'Alimentação' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'moradia', label: 'Moradia' },
    { value: 'saude', label: 'Saúde' },
    { value: 'educacao', label: 'Educação' },
    { value: 'lazer', label: 'Lazer' },
    { value: 'trabalho', label: 'Trabalho' },
    { value: 'outros', label: 'Outros' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao || !formData.valor) return;

    setCarregando(true);

    const dadosTransacao = {
      tipo: formData.tipo,
      descricao: formData.descricao,
      valor: parseFloat(formData.valor),
      categoria: formData.categoria,
      data: Timestamp.fromDate(new Date(formData.data))
    };

    let sucesso = false;

    if (transacaoEditando?.id) {
      sucesso = await onEditar(transacaoEditando.id, dadosTransacao);
    } else {
      sucesso = await onSalvar(dadosTransacao);
    }

    setCarregando(false);

    if (sucesso && !transacaoEditando) {
      setFormData({
        tipo: 'despesa',
        descricao: '',
        valor: '',
        categoria: 'alimentacao',
        data: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div
      className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-2xl w-full mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        {transacaoEditando ? (
          <Edit3 className="w-6 h-6 text-blue-600" />
        ) : (
          <Plus className="w-6 h-6 text-green-600" />
        )}
        <h2 className="text-xl font-semibold text-gray-800">
          {transacaoEditando ? 'Editar Transação' : 'Nova Transação'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
              required
            >
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
              required
            >
              {categorias.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
          <input
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Ex: Compra no supermercado"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$) *</label>
            <input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              placeholder="0,00"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              required
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={carregando}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all shadow hover:shadow-lg disabled:opacity-50"
          >
            {carregando ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {carregando ? 'Salvando...' : transacaoEditando ? 'Atualizar' : 'Adicionar'}
          </button>

          {transacaoEditando && onCancelar && (
            <button
              type="button"
              onClick={onCancelar}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default FormularioTransacao;
