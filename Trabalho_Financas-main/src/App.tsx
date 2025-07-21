import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import { useTransacoes } from './hooks/useTransacoes';
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FormularioTransacao from './components/FormularioTransacao';
import ListaTransacoes, { Transacao } from './components/ListaTransacoes';

function App() {
  const { usuario, carregando: carregandoAuth } = useAuth();
  const {
    transacoes,
    resumo,
    carregando: carregandoTransacoes,
    adicionarTransacao,
    editarTransacao,
    excluirTransacao,
  } = useTransacoes(usuario);

  const [transacaoEditando, setTransacaoEditando] = useState<Transacao | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSalvarTransacao = async (dadosTransacao: any) => {
    try {
      if (transacaoEditando) {
        await editarTransacao(transacaoEditando.id, dadosTransacao);
      } else {
        await adicionarTransacao(dadosTransacao);
      }
      setTransacaoEditando(null);
      setModalAberto(false);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  };

  const handleEditarTransacao = (transacao: Transacao) => {
    setTransacaoEditando(transacao);
    setModalAberto(true);
  };

  const handleCancelarEdicao = () => {
    setTransacaoEditando(null);
    setModalAberto(false);
  };

  const handleNovaTransacao = () => {
    setTransacaoEditando(null);
    setModalAberto(true);
  };

  const handleExcluirTransacao = async (id: string, descricao: string): Promise<boolean> => {
    try {
      await excluirTransacao(id, descricao);
      return true;
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      return false;
    }
  };

  // Fechar modal ao pressionar Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalAberto) {
        handleCancelarEdicao();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalAberto]);

  if (carregandoAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="loading"></div>
      </div>
    );
  }

  if (!usuario) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard resumo={resumo} carregando={carregandoTransacoes} />

        {/* Botão flutuante para nova transação */}
        <div className="mb-6 text-left">
          <button
            onClick={handleNovaTransacao}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all"
          >
            Nova Transação
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div>
            <ListaTransacoes
              transacoes={transacoes}
              carregando={carregandoTransacoes}
              onEditar={handleEditarTransacao}
              onExcluir={handleExcluirTransacao}
            />
          </div>
        </div>
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {modalAberto && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === modalRef.current) {
                handleCancelarEdicao();
              }
            }}
            ref={modalRef}
          >
            <motion.div
              className="bg-white relative rounded-xl p-6 w-full max-w-2xl shadow-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Botão de Fechar */}
              <button
                onClick={handleCancelarEdicao}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-lg font-bold"
                aria-label="Fechar"
              >
                ✕
              </button>

              <FormularioTransacao
                transacaoEditando={transacaoEditando}
                onSalvar={handleSalvarTransacao}
                onEditar={editarTransacao}
                onCancelar={handleCancelarEdicao}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
