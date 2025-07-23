import { useState } from "react";
import { useForm } from "../hooks/useForm";
import Input from "../components/Input";
import Button from "../components/Button";
import apiService from "../services/api";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  const validationRules = {
    email: [
      { required: true, message: "Email é obrigatório" },
      {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Email deve ter um formato válido",
      },
    ],
    password: [{ required: true, message: "Senha é obrigatória" }],
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormErrors,
  } = useForm(
    {
      email: "",
      password: "",
    },
    validationRules
  );

  const onSubmit = async (formData) => {
    try {
      setSubmitError("");
      await apiService.loginUser(formData);
      setSubmitSuccess(true);
    } catch (error) {
      if (
        error.message.includes("invalid credentials") ||
        error.message.includes("credenciais inválidas")
      ) {
        setFormErrors({ password: "Email ou senha inválidos" });
      } else {
        setSubmitError(
          error.message || "Erro ao fazer login. Tente novamente."
        );
      }
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Login realizado com sucesso!
              </h1>
              <p className="text-gray-600">Você está autenticado.</p>
              <Button
                onClick={() => setSubmitSuccess(false)}
                className="w-full"
              >
                Voltar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Entrar</h1>
          <p className="text-gray-600">Acesse sua conta para continuar</p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            />

            <Button
              type="submit"
              variant="green"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Não tem uma conta?{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                onClick={() => {
                  navigate("/register");
                }}
                tabIndex={0}
                aria-label="Ir para página de cadastro"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate("/register");
                  }
                }}
              >
                Criar conta
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
