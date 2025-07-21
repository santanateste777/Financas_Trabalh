import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { auth, provedorGoogle, db } from '../firebase/config';

export const useAuth = () => {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await criarOuAtualizarUsuario(user);
        setUsuario(user);
      } else {
        setUsuario(null);
      }
      setCarregando(false);
    });

    return unsubscribe;
  }, []);

  const criarOuAtualizarUsuario = async (user: User) => {
    const userRef = doc(db, 'usuarios', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        nome: user.displayName,
        email: user.email,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  };

  const entrarComGoogle = async () => {
    if (carregando) return; // evita múltiplas chamadas

    setCarregando(true);
    try {
      await signInWithPopup(auth, provedorGoogle);
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);

      if (error.code === 'auth/popup-blocked') {
        Swal.fire({
          icon: 'error',
          title: 'Popup bloqueado',
          text: 'Permita popups no navegador e tente novamente.'
        });
      } else if (error.code === 'auth/cancelled-popup-request') {
        Swal.fire({
          icon: 'warning',
          title: 'Login cancelado',
          text: 'Aguarde a resposta da janela de login anterior.'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro no login',
          text: 'Erro ao fazer login. Tente novamente.'
        });
      }
    } finally {
      setCarregando(false);
    }
  };

  const sair = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao sair:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível sair. Tente novamente.'
      });
    }
  };

  return {
    usuario,
    carregando,
    entrarComGoogle,
    sair
  };
};
