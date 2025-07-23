import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Logo from "../assets/Logo.png";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    joinedDate: "",
    avatar: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Perfil - ezDin";
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      // Simulando chamada da API
      setTimeout(() => {
        const userData = {
          name: "João Silva",
          email: "joao.silva@email.com",
          bio: "Estudante de finanças pessoais apaixonado por investimentos e educação financeira.",
          joinedDate: "Janeiro 2024",
          avatar: null,
        };
        setUser(userData);
        setValues({
          name: userData.name,
          email: userData.email,
          bio: userData.bio,
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      setIsLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!values.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!values.email.trim()) newErrors.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      newErrors.email = "Email inválido";
    return newErrors;
  };

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setSaveMessage("");
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
    setTouched({});
    setSaveMessage("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValues({
      name: user.name,
      email: user.email,
      bio: user.bio,
    });
    setErrors({});
    setTouched({});
    setSaveMessage("");
  };

  const handleSave = async () => {
    setTouched({ name: true, email: true, bio: true });
    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    setIsSaving(true);
    setSaveMessage("");

    try {
      // Simulando chamada da API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updatedUser = {
        ...user,
        name: values.name,
        email: values.email,
        bio: values.bio,
      };

      setUser(updatedUser);
      setIsEditing(false);
      setSaveMessage("Perfil atualizado com sucesso!");

      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      setSaveMessage("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser((prev) => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      // Limpar dados do usuário do localStorage/sessionStorage se necessário
      navigate("/");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-2 border-green-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={Logo} alt="Logo ezDin" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-green-600">ezDin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/plataforma")}
              aria-label="Voltar para plataforma"
            >
              ← Voltar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              aria-label="Sair da conta"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar do usuário"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      aria-label="Alterar foto do perfil"
                    />
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </label>
                )}
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                <p className="text-green-100 mb-1">{user.email}</p>
                <p className="text-green-200 text-sm">
                  Membro desde {user.joinedDate}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {saveMessage && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  saveMessage.includes("sucesso")
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {saveMessage}
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Informações Pessoais
              </h3>
              {!isEditing ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleEdit}
                  aria-label="Editar perfil"
                >
                  Editar Perfil
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                    aria-label="Cancelar edição"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="green"
                    size="sm"
                    onClick={handleSave}
                    loading={isSaving}
                    disabled={isSaving}
                    aria-label="Salvar alterações"
                  >
                    {isSaving ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nome Completo"
                value={isEditing ? values.name : user.name}
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                error={touched.name ? errors.name : ""}
                disabled={!isEditing}
                placeholder="Digite seu nome completo"
                aria-label="Nome completo"
              />

              <Input
                label="Email"
                type="email"
                value={isEditing ? values.email : user.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                error={touched.email ? errors.email : ""}
                disabled={!isEditing}
                placeholder="Digite seu email"
                aria-label="Email"
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografia
                </label>
                <textarea
                  value={isEditing ? values.bio : user.bio}
                  onChange={handleChange("bio")}
                  onBlur={handleBlur("bio")}
                  disabled={!isEditing}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                  className={`
                    w-full px-4 py-3
                    bg-white border border-gray-300
                    text-gray-900 placeholder-gray-500
                    rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-200 resize-none
                    ${!isEditing ? "bg-gray-50" : ""}
                  `}
                  aria-label="Biografia"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Estatísticas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-blue-700">Cursos Concluídos</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-green-700">
                    Taxa de Conclusão
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">24h</div>
                  <div className="text-sm text-purple-700">Tempo de Estudo</div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Segurança
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full md:w-auto"
                  aria-label="Alterar senha"
                >
                  Alterar Senha
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
