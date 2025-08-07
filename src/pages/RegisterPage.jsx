// Importação de hooks do React
import { useState, useEffect } from "react";

// Importação de componentes reutilizáveis
import Input from "../components/Input";
import Button from "../components/Button";

// Importa hook de navegação do React Router
import { useNavigate } from "react-router-dom";

// Importa o contexto de autenticação
import { useAuth } from "../contexts/AuthContext";

// Importa a imagem da logo
import Logo from "../assets/Logo.png";

// Componente principal da página de cadastro
const RegisterPage = () => {
  // Estado que armazena os valores digitados no formulário
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Estado que armazena os erros de validação por campo
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Estado que controla se o campo já foi "tocado" (para exibir erro somente após interação)
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Estado que indica se o formulário está sendo enviado
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para armazenar erro do envio (ex: erro do servidor)
  const [submitError, setSubmitError] = useState("");

  // Estado que indica se o cadastro foi bem-sucedido
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Hook para redirecionar o usuário
  const navigate = useNavigate();

  // Hook para acessar funções de autenticação
  const { register: registerUser, isAuthenticated } = useAuth();

  // Altera o título da aba ao carregar a página
  useEffect(() => {
    document.title = "Cadastro - ezDin";
  }, []);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/plataforma");
    }
  }, [isAuthenticated, navigate]);

  // Função que valida os campos do formulário
  const validate = () => {
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Verifica se o e-mail está preenchido e em formato válido
    if (!values.email) newErrors.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      newErrors.email = "Email inválido";

    // Validação da senha
    if (!values.password) newErrors.password = "Senha é obrigatória";
    else if (values.password.length < 6)
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    else if (values.password.length > 100)
      newErrors.password = "Senha deve ter no máximo 100 caracteres";

    // Validação da confirmação de senha
    if (!values.confirmPassword)
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    else if (values.confirmPassword !== values.password)
      newErrors.confirmPassword = "As senhas não coincidem";

    return newErrors;
  };

  // Atualiza o valor de um campo ao digitar
  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Marca um campo como "tocado" e revalida o formulário
  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  // Lógica principal de envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita reload da página

    // Marca todos os campos como "tocados" para exibir erros, se houver
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Valida os campos
    const validation = validate();
    setErrors(validation);

    // Se houver erros, cancela envio
    if (validation.email || validation.password || validation.confirmPassword) {
      return;
    }

    // Inicia o envio
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Envia os dados para o backend usando o contexto
      await registerUser({
        username: values.email,
        password: values.password,
      });
      
      console.log("Registro bem-sucedido");
      setSubmitSuccess(true); // Exibe tela de sucesso
    } catch (error) {
      // Exibe mensagem de erro recebida do servidor
      console.error("Erro durante o registro:", error);
      setSubmitError(error.message || "Erro desconhecido ao registrar.");
    } finally {
      // Finaliza envio
      setIsSubmitting(false);
    }
  };

  // Se o cadastro for bem-sucedido, renderiza uma tela de sucesso
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg p-8 shadow-lg border border-green-100">
            <div className="text-center">
              {/* Ícone de sucesso */}
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Mensagem de sucesso */}
              <h1 className="text-3xl font-bold text-green-700 mb-2">
                Conta criada com sucesso!
              </h1>
              <p className="text-green-700">
                Sua conta foi criada com sucesso. Agora você pode fazer login.
              </p>

              {/* Botão para ir para login */}
              <button
                onClick={() => navigate("/")}
                className="w-full mt-6 text-blue-600 hover:text-blue-700 font-medium text-base transition-colors underline"
                aria-label="Ir para Login"
                tabIndex={0}
              >
                Fazer login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderização principal da página de cadastro
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Cabeçalho com logo e slogan */}
        <div className="flex flex-col items-center mb-8">
          <img src={Logo} alt="Logo ezDin" className="w-20 h-20 mb-2" />
          <h1 className="text-3xl font-extrabold text-green-600 mb-1 tracking-tight">
            ezDin
          </h1>
          <span className="text-green-700 text-base font-medium mb-1">
            Aprenda, controle. Fácil assim!
          </span>
        </div>

        {/* Formulário com sombra e borda */}
        <div className="bg-white rounded-lg p-8 shadow-lg border border-green-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exibe erro do servidor (se houver) */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}

            {/* Campo de email */}
            <Input
              label="Email"
              type="email"
              placeholder="Digite seu email"
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              error={touched.email ? errors.email : ""}
              disabled={isSubmitting}
              autoComplete="username"
              aria-label="Email"
              tabIndex={0}
            />

            {/* Campo de senha */}
            <Input
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              value={values.password}
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
              error={touched.password ? errors.password : ""}
              disabled={isSubmitting}
              autoComplete="new-password"
              aria-label="Senha"
              tabIndex={0}
            />

            {/* Campo de confirmação de senha */}
            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="Digite sua senha novamente"
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              error={touched.confirmPassword ? errors.confirmPassword : ""}
              disabled={isSubmitting}
              autoComplete="new-password"
              aria-label="Confirmar Senha"
              tabIndex={0}
            />

            {/* Botão de envio */}
            <Button
              type="submit"
              variant="green"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full"
              aria-label="Criar Conta"
              tabIndex={0}
            >
              {isSubmitting ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>

          {/* Link para login, se já tiver conta */}
          <div className="mt-6 text-center">
            <p className="text-green-700 text-sm">
              Já tem uma conta?{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline cursor-pointer"
                onClick={() => navigate("/")}
                tabIndex={0}
                aria-label="Ir para página de login"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate("/");
                  }
                }}
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporta o componente para uso em outras partes do app
export default RegisterPage;
