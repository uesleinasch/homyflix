import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DashboardPage: React.FC = () => {
  const { user, logoutUser } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Sair
        </button>
      </div>

      {user && (
        <div className="mb-8">
          <p className="text-lg">Bem-vindo, {user.name}!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/movies"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Meus Filmes</h2>
          <p className="text-gray-600">Visualizar todos os filmes cadastrados</p>
        </Link>

        <Link
          to="/movies/create"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Adicionar Filme</h2>
          <p className="text-gray-600">Cadastrar um novo filme na biblioteca</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
