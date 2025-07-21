import { useEffect } from 'react';
import FormularioTransacao from './FormularioTransacao';
import { Transacao } from '../hooks/useTransacoes';
import { X } from 'lucide-react';

interface ModalProps {
  aberto: boolean;
  transacaoEditando?: Transacao | null;
  onSalvar: (dados: any) => Promise<boolean>;
  onEditar: (id: string, dados: Partial<Transacao>) => Promise<boolean>;
  onCancelar: () => void;
}

const ModalTransacao = ({
  aberto,
  transacaoEditando,
  onSalvar,
  onEditar,
  onCancelar,
}: ModalProps) => {
  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : 'auto';
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-colors"
          onClick={onCancelar}
          aria-label="Fechar modal"
        >
          <X className="w-6 h-6" />
        </button>

        <FormularioTransacao
          transacaoEditando={transacaoEditando}
          onSalvar={onSalvar}
          onEditar={onEditar}
          onCancelar={onCancelar}
        />
      </div>
    </div>
  );
};

export default ModalTransacao;
