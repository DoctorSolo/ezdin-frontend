import { useState, useEffect } from "react";
import { useForm } from "../hooks/useForm";
import Input from "../components/Input";
import Button from "../components/Button";
import apiService from "../services/api";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Cadastro - ezDin";
  }, []);

  const validationRules = {
    fullName: [
      { required: true, message: "Nome completo é obrigatório" },
      { minLength: 2, message: "Nome deve ter pelo menos 2 caracteres" },
      { maxLength: 100, message: "Nome deve ter no máximo 100 caracteres" },
    ],
    email: [
      { required: true, message: "Email é obrigatório" },
      {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Email deve ter um formato válido",
      },
    ],
    password: [
      { required: true, message: "Senha é obrigatória" },
      { minLength: 6, message: "Senha deve ter pelo menos 6 caracteres" },
      { maxLength: 100, message: "Senha deve ter no máximo 100 caracteres" },
    ],
    confirmPassword: [
      { required: true, message: "Confirmação de senha é obrigatória" },
      {
        custom: (value, values) => {
          if (value !== values.password) {
            return "As senhas não coincidem";
          }
          return null;
        },
      },
    ],
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
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationRules
  );

  const onSubmit = async (formData) => {
    try {
      setSubmitError("");

      // Remove confirmPassword from submission data
      const { ...submitData } = formData;

      await apiService.registerUser(submitData);

      setSubmitSuccess(true);
    } catch (error) {
      if (
        error.message.includes("email already exists") ||
        error.message.includes("já existe")
      ) {
        setFormErrors({ email: "Este email já está cadastrado" });
      } else {
        setSubmitError(
          error.message || "Erro ao criar conta. Tente novamente."
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
                Conta criada com sucesso!
              </h1>
              <p className="text-gray-600">
                Sua conta foi criada com sucesso. Agora você pode fazer login.
              </p>
              <Button
                onClick={() => setSubmitSuccess(false)}
                className="w-full"
              >
                Ir para Login
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h1>
          <p className="text-gray-600">Preencha seus dados para começar</p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}

            <Input
              label="Nome Completo"
              type="text"
              placeholder="Digite seu nome completo"
              value={values.fullName}
              onChange={handleChange("fullName")}
              onBlur={handleBlur("fullName")}
              error={touched.fullName ? errors.fullName : ""}
              disabled={isSubmitting}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Digite seu email"
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              error={touched.email ? errors.email : ""}
              disabled={isSubmitting}
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
            />

            <Button
              type="submit"
              variant="green"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Já tem uma conta?{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                onClick={() => {
                  navigate("/login");
                }}
                tabIndex={0}
                aria-label="Ir para página de login"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate("/login");
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
