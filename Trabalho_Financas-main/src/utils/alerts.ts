import Swal from 'sweetalert2';

// Configuração padrão do SweetAlert2
const configuracaoPadrao = {
  confirmButtonColor: '#3b82f6',
  cancelButtonColor: '#6b7280',
  background: '#ffffff',
  color: '#374151',
  borderRadius: '0.5rem',
  customClass: {
    popup: 'shadow-xl',
    confirmButton: 'font-semibold px-4 py-2 rounded-lg',
    cancelButton: 'font-semibold px-4 py-2 rounded-lg'
  }
};

export const mostrarSucesso = (titulo: string, texto?: string) => {
  return Swal.fire({
    ...configuracaoPadrao,
    title: titulo,
    text: texto,
    icon: 'success',
    position: 'top-end',
    toast: true,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    background: '#f0fdf4',
    color: '#166534'
  });
};

export const mostrarErro = (titulo: string, texto?: string) => {
  return Swal.fire({
    ...configuracaoPadrao,
    title: titulo,
    text: texto,
    icon: 'error',
    position: 'top-end',
    toast: true,
    timer: 4000,
    timerProgressBar: true,
    showConfirmButton: false,
    background: '#fef2f2',
    color: '#dc2626'
  });
};

export const mostrarCarregando = (titulo: string = 'Processando...') => {
  return Swal.fire({
    ...configuracaoPadrao,
    title: titulo,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

export const confirmarExclusao = async (titulo: string = 'Tem certeza?', texto: string = 'Você não poderá reverter essa ação!') => {
  const resultado = await Swal.fire({
    ...configuracaoPadrao,
    title: titulo,
    text: texto,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    focusCancel: true
  });

  return resultado.isConfirmed;
};

export const mostrarInfo = (titulo: string, texto?: string) => {
  return Swal.fire({
    ...configuracaoPadrao,
    title: titulo,
    text: texto,
    icon: 'info',
    confirmButtonText: 'Entendi'
  });
};