import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLessons } from "../contexts/LessonsContext";

const AdminContentBuilder = () => {
  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    challenge_question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "a",
    explanation: "",
    points_awarded: 10,
    order_index: 1,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createStatus, setCreateStatus] = useState("");
  const navigate = useNavigate();
  const { lessons, loading, createLesson } = useLessons();

  useEffect(() => {
    if (lessons.length > 0) {
      setNewLesson(prev => ({
        ...prev,
        order_index: Math.max(...lessons.map(l => l.order_index || 0)) + 1
      }));
    }
  }, [lessons]);

  const handleInputChange = (field) => (e) => {
    const value = field === 'points_awarded' || field === 'order_index' 
      ? parseInt(e.target.value) || 0 
      : e.target.value;
    setNewLesson(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    
    if (!newLesson.title || !newLesson.content || !newLesson.challenge_question || 
        !newLesson.option_a || !newLesson.option_b || !newLesson.option_c || !newLesson.option_d) {
      setCreateStatus("Todos os campos são obrigatórios!");
      return;
    }

    setIsCreating(true);
    setCreateStatus("");

    try {
      await createLesson(newLesson);
      setCreateStatus("Lição criada com sucesso!");
      setNewLesson({
        title: "",
        content: "",
        challenge_question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "a",
        explanation: "",
        points_awarded: 10,
        order_index: Math.max(...lessons.map(l => l.order_index || 0)) + 2,
      });
      setTimeout(() => setCreateStatus(""), 3000);
    } catch (error) {
      console.error("Erro ao criar lição:", error);
      setCreateStatus(`Erro ao criar lição: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-700">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Administração de Conteúdo
          </h1>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            onClick={() => navigate("/plataforma")}
          >
            Voltar para Plataforma
          </button>
        </div>

        {/* Status Message */}
        {createStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            createStatus.includes("sucesso") 
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            {createStatus}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form para criar nova lição */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Criar Nova Lição
            </h2>
            
            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Lição
                </label>
                <input
                  type="text"
                  value={newLesson.title}
                  onChange={handleInputChange("title")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Digite o título da lição"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo da Lição
                </label>
                <textarea
                  value={newLesson.content}
                  onChange={handleInputChange("content")}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  placeholder="Digite o conteúdo explicativo da lição"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pergunta do Desafio
                </label>
                <input
                  type="text"
                  value={newLesson.challenge_question}
                  onChange={handleInputChange("challenge_question")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Digite a pergunta do desafio"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opção A
                </label>
                <input
                  type="text"
                  value={newLesson.option_a}
                  onChange={handleInputChange("option_a")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Digite a opção A"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opção B
                </label>
                <input
                  type="text"
                  value={newLesson.option_b}
                  onChange={handleInputChange("option_b")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Digite a opção B"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opção C
                </label>
                <input
                  type="text"
                  value={newLesson.option_c}
                  onChange={handleInputChange("option_c")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Digite a opção C"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opção D
                </label>
                <input
                  type="text"
                  value={newLesson.option_d}
                  onChange={handleInputChange("option_d")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Digite a opção D"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resposta Correta
                </label>
                <select
                  value={newLesson.correct_option}
                  onChange={handleInputChange("correct_option")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="a">A</option>
                  <option value="b">B</option>
                  <option value="c">C</option>
                  <option value="d">D</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explicação da Resposta
                </label>
                <textarea
                  value={newLesson.explanation}
                  onChange={handleInputChange("explanation")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  placeholder="Digite uma explicação para a resposta correta"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pontos
                  </label>
                  <input
                    type="number"
                    value={newLesson.points_awarded}
                    onChange={handleInputChange("points_awarded")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordem
                  </label>
                  <input
                    type="number"
                    value={newLesson.order_index}
                    onChange={handleInputChange("order_index")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating ? "Criando..." : "Criar Lição"}
              </button>
            </form>
          </div>

          {/* Lista de lições existentes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Lições Existentes ({lessons.length})
            </h2>
            
            {lessons.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhuma lição criada ainda.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {lessons
                  .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                  .map((lesson) => (
                    <div
                      key={lesson.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 mb-1">
                            {lesson.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {lesson.content.substring(0, 100)}...
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Ordem: {lesson.order_index}</span>
                            <span>Pontos: {lesson.points_awarded}</span>
                            <span className={`px-2 py-1 rounded-full ${
                              lesson.is_completed 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              {lesson.is_completed ? "Concluída" : "Pendente"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContentBuilder;
