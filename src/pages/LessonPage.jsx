import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLessons } from "../contexts/LessonsContext";

const LessonPage = ({ lessonData }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUserPoints } = useAuth();
  const { completeLesson } = useLessons();

  useEffect(() => {
    // Reset ao mudar de lição
    setSelectedOption("");
    setResult(null);
  }, [lessonData?.id]);

  const handleSubmitAnswer = async () => {
    if (!selectedOption) {
      alert("Por favor, selecione uma opção.");
      return;
    }

    setLoading(true);
    try {
      const response = await completeLesson(lessonData.id, selectedOption);
      setResult(response);
      
      // Atualizar pontos do usuário em tempo real se a resposta estiver correta
      if (response.correct && response.user_total_points) {
        console.log('Atualizando pontos de', user?.points, 'para', response.user_total_points);
        updateUserPoints(response.user_total_points);
      }
    } catch (error) {
      console.error("Erro ao completar lição:", error);
      alert(error.message || "Erro ao enviar resposta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/plataforma");
  };

  if (!lessonData) {
    return (
      <div className="p-8 text-center text-red-600">
        Dados da lição não encontrados.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-green-700 hover:text-green-900 font-medium mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar para a Trilha
          </button>
          <h1 className="text-3xl font-bold text-green-800">
            {lessonData.title}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {lessonData.points_awarded} pontos
            </span>
            {lessonData.is_completed && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ✓ Concluída
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Lesson Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Conteúdo da Lição
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {lessonData.content}
            </p>
          </div>
        </div>

        {/* Question Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Desafio
          </h2>
          <p className="text-gray-700 mb-6 text-lg">
            {lessonData.challenge_question}
          </p>
          
          {!lessonData.is_completed && !result ? (
            <div>
              {/* Multiple Choice Options */}
              <div className="space-y-3 mb-6">
                {lessonData.options && Object.entries(lessonData.options).map(([key, value]) => (
                  <label
                    key={key}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOption === key
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={key}
                      checked={selectedOption === key}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="mr-3 text-green-600 focus:ring-green-500"
                      disabled={loading}
                    />
                    <span className="text-gray-700 font-medium mr-2">
                      {key.toUpperCase()})
                    </span>
                    <span className="text-gray-700">
                      {value}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleSubmitAnswer}
                disabled={loading || !selectedOption}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Enviando..." : "Enviar Resposta"}
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm">
                {lessonData.is_completed 
                  ? "Você já completou esta lição!" 
                  : "Lição completada nesta sessão!"
                }
              </p>
            </div>
          )}
        </div>

        {/* Result Section */}
        {result && (
          <div className={`rounded-lg shadow-sm border p-6 mb-6 ${
            result.correct 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                result.correct ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {result.correct ? '✓' : '✗'}
              </div>
              <h3 className={`text-lg font-semibold ${
                result.correct ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.correct ? 'Correto!' : 'Incorreto!'}
              </h3>
            </div>
            
            <p className={`mb-4 ${
              result.correct ? 'text-green-700' : 'text-red-700'
            }`}>
              {result.message}
            </p>

            {!result.correct && result.correct_answer && (
              <p className="text-red-700 mb-4">
                <strong>Resposta correta:</strong> {result.correct_answer}
              </p>
            )}

            {result.explanation && (
              <div className="bg-white rounded-lg p-4 border mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Explicação:</h4>
                <p className="text-gray-700">{result.explanation}</p>
              </div>
            )}

            {result.correct && (
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">
                    Pontos ganhos:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    +{result.points_awarded}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">
                    Total de pontos:
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    {result.user_total_points}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Seus Pontos
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total de pontos:</span>
            <span className="text-2xl font-bold text-green-600">
              {user?.points || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
