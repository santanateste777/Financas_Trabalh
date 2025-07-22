import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Transacao } from '../hooks/useTransacoes';

interface Props {
  transacoes: Transacao[];
}

interface DadoMensal {
  mes: string;
  receitas: number;
  despesas: number;
}

const GraficoFinancas = ({ transacoes }: Props) => {
  const anos = useMemo(() => {
    const lista = Array.from(
      new Set(
        transacoes.map(t => new Date(t.data.seconds * 1000).getFullYear())
      )
    );
    return lista.sort((a, b) => a - b);
  }, [transacoes]);

  const [anoSelecionado, setAnoSelecionado] = useState(
    anos[0] || new Date().getFullYear()
  );

  const dadosMensais: DadoMensal[] = useMemo(() => {
    const meses = Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(0, i).toLocaleString('pt-BR', { month: 'short' }),
      receitas: 0,
      despesas: 0
    }));

    transacoes.forEach(t => {
      const data = new Date(t.data.seconds * 1000);
      if (data.getFullYear() === anoSelecionado) {
        const idx = data.getMonth();
        if (t.tipo === 'receita') meses[idx].receitas += t.valor;
        else meses[idx].despesas += t.valor;
      }
    });

    return meses;
  }, [transacoes, anoSelecionado]);

  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);

  return (
    <div className="card mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-xl font-semibold text-gray-800">
          Finanças Mensais
        </h2>
        <select
          value={anoSelecionado}
          onChange={e => setAnoSelecionado(parseInt(e.target.value))}
          className="input-field w-32"
        >
          {anos.map(ano => (
            <option key={ano} value={ano}>
              {ano}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dadosMensais}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" interval={0} tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip formatter={value => formatarMoeda(Number(value))} />
            <Bar dataKey="receitas" name="Receitas" stackId="a" fill="#16a34a" />
            <Bar dataKey="despesas" name="Despesas" stackId="a" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficoFinancas;
