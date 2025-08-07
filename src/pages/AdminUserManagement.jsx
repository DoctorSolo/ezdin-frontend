import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Verificar se o usuário é admin
  useEffect(() => {
    if (!user?.is_admin) {
      navigate("/plataforma");
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/admin/users", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        const errorData = await response.json();
        setMessage(`Erro: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setMessage("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const promoteUser = async (userId) => {
    setActionLoading(prev => ({ ...prev, [userId]: "promoting" }));
    try {
      const response = await fetch(`http://localhost:5000/api/auth/admin/users/${userId}/promote`, {
        method: "PUT",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ ${data.message}`);
        fetchUsers(); // Recarregar lista
      } else {
        const errorData = await response.json();
        setMessage(`❌ ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro ao promover usuário:", error);
      setMessage("❌ Erro ao promover usuário");
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const demoteUser = async (userId) => {
    setActionLoading(prev => ({ ...prev, [userId]: "demoting" }));
    try {
      const response = await fetch(`http://localhost:5000/api/auth/admin/users/${userId}/demote`, {
        method: "PUT",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ ${data.message}`);
        fetchUsers(); // Recarregar lista
      } else {
        const errorData = await response.json();
        setMessage(`❌ ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro ao remover privilégios:", error);
      setMessage("❌ Erro ao remover privilégios");
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.")) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [userId]: "deleting" }));
    try {
      const response = await fetch(`http://localhost:5000/api/auth/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ ${data.message}`);
        fetchUsers(); // Recarregar lista
      } else {
        const errorData = await response.json();
        setMessage(`❌ ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      setMessage("❌ Erro ao deletar usuário");
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
      setTimeout(() => setMessage(""), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-700">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Gerenciamento de Usuários
          </h1>
          <div className="flex gap-3">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => navigate("/admin")}
            >
              Criar Lições
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              onClick={() => navigate("/plataforma")}
            >
              Voltar para Plataforma
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.includes("✅") 
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Usuários</p>
                <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Administradores</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {users.filter(u => u.is_admin).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Usuários Regulares</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {users.filter(u => !u.is_admin).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Lista de Usuários</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pontos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Cadastro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {userItem.name ? userItem.name[0].toUpperCase() : userItem.username[0].toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userItem.name || "Sem nome"}
                          </div>
                          <div className="text-sm text-gray-500">{userItem.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{userItem.points} pontos</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        userItem.is_admin 
                          ? "bg-purple-100 text-purple-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {userItem.is_admin ? "Administrador" : "Usuário"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(userItem.joined_date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {!userItem.is_admin ? (
                          <button
                            onClick={() => promoteUser(userItem.id)}
                            disabled={actionLoading[userItem.id] === "promoting"}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading[userItem.id] === "promoting" ? "Promovendo..." : "Promover"}
                          </button>
                        ) : userItem.id !== user.id && (
                          <button
                            onClick={() => demoteUser(userItem.id)}
                            disabled={actionLoading[userItem.id] === "demoting"}
                            className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading[userItem.id] === "demoting" ? "Removendo..." : "Remover Admin"}
                          </button>
                        )}
                        
                        {userItem.id !== user.id && (
                          <button
                            onClick={() => deleteUser(userItem.id)}
                            disabled={actionLoading[userItem.id] === "deleting"}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                          >
                            {actionLoading[userItem.id] === "deleting" ? "Deletando..." : "Deletar"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
