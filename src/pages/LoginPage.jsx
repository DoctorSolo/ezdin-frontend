import { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../assets/Logo.png";

const LoginPage = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "Login - ezDin";
  }, []);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/plataforma");
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const newErrors = { email: "", password: "" };
    if (!values.email) newErrors.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      newErrors.email = "Email inválido";
    if (!values.password) newErrors.password = "Senha é obrigatória";
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
    setTouched({ email: true, password: true });
    const validation = validate();
    setErrors(validation);
    if (validation.email || validation.password) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await login({
        username: values.email,
        password: values.password,
      });
      navigate("/plataforma");
    } catch (error) {
      console.error("Erro durante o login:", error);
      setSubmitError(error.message || "Erro desconhecido ao fazer login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <img src={Logo} alt="Logo ezDin" className="w-20 h-20 mb-2" />
          <h1 className="text-3xl font-extrabold text-green-600 mb-1 tracking-tight">
            ezDin
          </h1>
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
              autoComplete="current-password"
              aria-label="Senha"
              tabIndex={0}
            />
            <Button
              type="submit"
              variant="green"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full"
              aria-label="Entrar"
              tabIndex={0}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-green-700 text-sm">
              Não tem uma conta?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline"
                tabIndex={0}
                aria-label="Ir para página de cadastro"
              >
                Criar conta
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
