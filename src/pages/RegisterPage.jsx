import { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import logo_full_branca from "../assets/logo_full_branca.png";

const RegisterPage = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Cadastro - ezDin";
  }, []);

  const validate = () => {
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
    };
    if (!values.email) newErrors.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      newErrors.email = "Email inválido";
    if (!values.password) newErrors.password = "Senha é obrigatória";
    else if (values.password.length < 6)
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    else if (values.password.length > 100)
      newErrors.password = "Senha deve ter no máximo 100 caracteres";
    if (!values.confirmPassword)
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    else if (values.confirmPassword !== values.password)
      newErrors.confirmPassword = "As senhas não coincidem";
    return newErrors;
  };

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
    });
    const validation = validate();
    setErrors(validation);
    if (validation.email || validation.password || validation.confirmPassword) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch(
        "https://ezdin-backend.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.email,
            password: values.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Registro bem-sucedido:", data);
        setSubmitSuccess(true);
      } else {
        setSubmitError(data.message || "Erro desconhecido ao registrar.");
      }
    } catch (error) {
      console.error("Erro durante o registro:", error);
      setSubmitError(
        "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg p-8 shadow-lg border border-green-100">
            <div className="text-center">
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
              <h1 className="text-3xl font-bold text-green-700 mb-2">
                Conta criada com sucesso!
              </h1>
              <p className="text-green-700">
                Sua conta foi criada com sucesso. Agora você pode fazer login.
              </p>
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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-600 px-6 py-4 rounded-lg mb-4">
            <img src={logo_full_branca} alt="Logo ezDin" className="w-25 h-7" />
          </div>
          <span className="text-green-700 text-base font-medium mb-1">
            Aprenda, controle. Fácil assim!
          </span>
        </div>
        <div className="bg-white rounded-lg p-8 shadow-lg border border-green-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}
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

export default RegisterPage;
