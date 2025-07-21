import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface Props {
  resumo: {
    receitas: number;
    despesas: number;
    saldo: number;
  };
  carregando: boolean;
}

const Dashboard = ({ resumo, carregando }: Props) => {
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (carregando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <motion.div 
        variants={cardVariants}
        className="card bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Receitas</p>
            <p className="text-2xl font-bold">{formatarMoeda(resumo.receitas)}</p>
          </div>
          <TrendingUp className="w-8 h-8 opacity-80" />
        </div>
      </motion.div>
      
      <motion.div 
        variants={cardVariants}
        className="card bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm font-medium">Despesas</p>
            <p className="text-2xl font-bold">{formatarMoeda(resumo.despesas)}</p>
          </div>
          <TrendingDown className="w-8 h-8 opacity-80" />
        </div>
      </motion.div>
      
      <motion.div 
        variants={cardVariants}
        className={`card bg-gradient-to-r ${resumo.saldo >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Saldo</p>
            <p className="text-2xl font-bold">{formatarMoeda(resumo.saldo)}</p>
          </div>
          <Wallet className="w-8 h-8 opacity-80" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;