import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';
import { mostrarSucesso, mostrarErro, confirmarExclusao } from '../utils/alerts';

export interface Transacao {
  id: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  categoria: string;
  data: Timestamp;
  usuarioId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const useTransacoes = () => {
  const { usuario } = useAuth();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Listener em tempo real para transações
  useEffect(() => {
    if (!usuario) {
      setTransacoes([]);
      setCarregando(false);
      return;
    }

    setCarregando(true);
    
    const q = query(
      collection(db, 'transacoes'),
      where('usuarioId', '==', usuario.uid),
      orderBy('data', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const transacoesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transacao[];
        
        setTransacoes(transacoesData);
        setCarregando(false);
      },
      (error) => {
        console.error('Erro ao carregar transações:', error);
        mostrarErro('Erro', 'Não foi possível carregar as transações');
        setCarregando(false);
      }
    );

    return () => unsubscribe();
  }, [usuario]);

  const adicionarTransacao = async (dadosTransacao: Omit<Transacao, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'>) => {
    if (!usuario) return false;

    try {
      const novaTransacao = {
        ...dadosTransacao,
        usuarioId: usuario.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(collection(db, 'transacoes'), novaTransacao);
      
      mostrarSucesso(
        'Transação adicionada!', 
        `${dadosTransacao.tipo === 'receita' ? 'Receita' : 'Despesa'} de R$ ${dadosTransacao.valor.toFixed(2)} foi registrada`
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      mostrarErro('Erro', 'Não foi possível adicionar a transação');
      return false;
    }
  };

  const editarTransacao = async (id: string, dadosTransacao: Partial<Transacao>) => {
    try {
      const transacaoRef = doc(db, 'transacoes', id);
      await updateDoc(transacaoRef, {
        ...dadosTransacao,
        updatedAt: Timestamp.now()
      });

      mostrarSucesso('Transação atualizada!', 'As alterações foram salvas com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao editar transação:', error);
      mostrarErro('Erro', 'Não foi possível atualizar a transação');
      return false;
    }
  };

  const excluirTransacao = async (id: string, descricao: string) => {
    const confirmado = await confirmarExclusao(
      'Excluir transação?',
      `A transação "${descricao}" será removida permanentemente.`
    );

    if (!confirmado) return false;

    try {
      await deleteDoc(doc(db, 'transacoes', id));
      mostrarSucesso('Transação excluída!', 'A transação foi removida com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      mostrarErro('Erro', 'Não foi possível excluir a transação');
      return false;
    }
  };

  // Cálculos em tempo real
  const resumo = {
    receitas: transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((total, t) => total + t.valor, 0),
    despesas: transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((total, t) => total + t.valor, 0),
    get saldo() {
      return this.receitas - this.despesas;
    }
  };

  return {
    transacoes,
    carregando,
    resumo,
    adicionarTransacao,
    editarTransacao,
    excluirTransacao
  };
};