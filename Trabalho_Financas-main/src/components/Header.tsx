import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { usuario, sair } = useAuth();

  return (
    <header className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 flex-wrap gap-y-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            💸 Finanças Pessoais
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={usuario?.photoURL || 'https://placehold.co/32x32/png'}
                alt="Foto do usuário"
                className="w-9 h-9 rounded-full border border-gray-300"
              />
              <span className="text-gray-700 font-medium hidden sm:block truncate max-w-[150px]">
                {usuario?.displayName}
              </span>
            </div>

            <button
              onClick={sair}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1.5 rounded-xl text-sm transition-colors border border-red-200"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
