import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { conteudo as conteudoBase } from "../data/conteudo";

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const AdminContentBuilder = () => {
  const [conteudo, setConteudo] = useState(() => {
    const saved = localStorage.getItem("conteudo");
    return saved ? JSON.parse(saved) : deepClone(conteudoBase);
  });
  const [moduloSelecionado, setModuloSelecionado] = useState(null);
  const [aulaSelecionada, setAulaSelecionada] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const navigate = useNavigate();

  // Função para salvar o conteúdo (exemplo: localStorage, pode ser adaptada para API)
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("");
    try {
      // Simulação de salvamento (substitua por chamada de API se necessário)
      localStorage.setItem("conteudo", JSON.stringify(conteudo));
      setSaveStatus("Salvo com sucesso!");
    } catch {
      setSaveStatus("Erro ao salvar!");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  // CRUD de módulos
  const handleAddModulo = () => {
    const nome = prompt("Nome do novo módulo:");
    if (!nome) return;
    setConteudo([...conteudo, { id: Date.now(), nome, aulas: [] }]);
  };
  const handleEditModulo = (id) => {
    const nome = prompt("Novo nome do módulo:");
    if (!nome) return;
    setConteudo(conteudo.map((m) => (m.id === id ? { ...m, nome } : m)));
  };
  const handleDeleteModulo = (id) => {
    if (!window.confirm("Remover módulo?")) return;
    setConteudo(conteudo.filter((m) => m.id !== id));
    if (moduloSelecionado === id) setModuloSelecionado(null);
  };

  // CRUD de aulas
  const handleAddAula = () => {
    if (!conteudo.length) return alert("Crie um módulo primeiro!");
    const titulo = prompt("Título da nova aula:");
    if (!titulo) return;
    const moduloId = Number(
      prompt(
        "ID do módulo para esta aula: " +
          conteudo.map((m) => `\n${m.id}: ${m.nome}`).join("")
      )
    );
    if (!conteudo.find((m) => m.id === moduloId))
      return alert("Módulo inválido!");
    setConteudo(
      conteudo.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              aulas: [
                ...m.aulas,
                { id: Date.now(), titulo, explicacoes: [""], questoes: [] },
              ],
            }
          : m
      )
    );
  };
  const handleEditAula = (moduloId, aulaId) => {
    const titulo = prompt("Novo título da aula:");
    if (!titulo) return;
    setConteudo(
      conteudo.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              aulas: m.aulas.map((a) =>
                a.id === aulaId ? { ...a, titulo } : a
              ),
            }
          : m
      )
    );
  };
  const handleDeleteAula = (moduloId, aulaId) => {
    if (!window.confirm("Remover aula?")) return;
    setConteudo(
      conteudo.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              aulas: m.aulas.filter((a) => a.id !== aulaId),
            }
          : m
      )
    );
    setAulaSelecionada(null);
  };
  // Mover aula para outro módulo
  const handleMoveAula = (fromModuloId, aulaId, toModuloId) => {
    if (fromModuloId === toModuloId) return;
    const aula = conteudo
      .find((m) => m.id === fromModuloId)
      .aulas.find((a) => a.id === aulaId);
    setConteudo(
      conteudo.map((m) => {
        if (m.id === fromModuloId) {
          return { ...m, aulas: m.aulas.filter((a) => a.id !== aulaId) };
        } else if (m.id === toModuloId) {
          return { ...m, aulas: [...m.aulas, aula] };
        } else {
          return m;
        }
      })
    );
  };

  // CRUD de explicações
  const handleAddExplicacao = (moduloId, aulaId) => {
    setConteudo(
      conteudo.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              aulas: m.aulas.map((a) =>
                a.id === aulaId
                  ? {
                      ...a,
                      explicacoes: [...a.explicacoes, ""],
                    }
                  : a
              ),
            }
          : m
      )
    );
  };
  const handleEditExplicacao = (moduloId, aulaId, idx, texto) => {
    setConteudo(
      conteudo.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              aulas: m.aulas.map((a) =>
                a.id === aulaId
                  ? {
                      ...a,
                      explicacoes: a.explicacoes.map((e, i) =>
                        i === idx ? texto : e
                      ),
                    }
                  : a
              ),
            }
          : m
      )
    );
  };
  const handleDeleteExplicacao = (moduloId, aulaId, idx) => {
    setConteudo(
      conteudo.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              aulas: m.aulas.map((a) =>
                a.id === aulaId
                  ? {
                      ...a,
                      explicacoes: a.explicacoes.filter((_, i) => i !== idx),
                    }
                  : a
              ),
            }
          : m
      )
    );
  };

  // CRUD de questões
  const handleAddQuestao = (moduloId, aulaId) => {
    setConteudo(
      conteudo.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              aulas: m.aulas.map((a) =>
                a.id === aulaId
                  ? {
                      ...a,
                      questoes: [
                        ...a.questoes,
                        {
                          id: Date.now(),
                          enunciado: "",
                          opcoes: ["", "", "", ""],
                          correta: 0,
                          explicacao: "",
                        },
                      ],
                    }
                  : a
              ),
            }
          : m
      )
    );
  };
  const handleEditQuestao = (moduloId, aulaId, questaoIdx, campo, valor) => {
    setConteudo(
      conteudo.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              aulas: m.aulas.map((a) =>
                a.id === aulaId
                  ? {
                      ...a,
                      questoes: a.questoes.map((q, i) =>
                        i === questaoIdx ? { ...q, [campo]: valor } : q
                      ),
                    }
                  : a
              ),
            }
          : m
      )
    );
  };
  const handleEditQuestaoOpcao = (
    moduloId,
    aulaId,
    questaoIdx,
    opcaoIdx,
    valor
  ) => {
    setConteudo(
      conteudo.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              aulas: m.aulas.map((a) =>
                a.id === aulaId
                  ? {
                      ...a,
                      questoes: a.questoes.map((q, i) =>
                        i === questaoIdx
                          ? {
                              ...q,
                              opcoes: q.opcoes.map((o, j) =>
                                j === opcaoIdx ? valor : o
                              ),
                            }
                          : q
                      ),
                    }
                  : a
              ),
            }
          : m
      )
    );
  };
  const handleDeleteQuestao = (moduloId, aulaId, questaoIdx) => {
    setConteudo(
      conteudo.map((m) =>
        m.id === moduloId
          ? {
              ...m,
              aulas: m.aulas.map((a) =>
                a.id === aulaId
                  ? {
                      ...a,
                      questoes: a.questoes.filter((_, i) => i !== questaoIdx),
                    }
                  : a
              ),
            }
          : m
      )
    );
  };

  // Renderização
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold flex-1">Administração de Conteúdo</h1>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          onClick={() => navigate("/plataforma")}
          aria-label="Voltar para Plataforma"
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && navigate("/plataforma")
          }
        >
          Voltar para Plataforma
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
          onClick={handleSave}
          aria-label="Salvar alterações"
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleSave()
          }
          disabled={isSaving}
        >
          {isSaving ? "Salvando..." : "Salvar"}
        </button>
        {saveStatus && (
          <span className="ml-2 text-green-600 font-medium" aria-live="polite">
            {saveStatus}
          </span>
        )}
      </div>
      {/* Lista de módulos */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <h2 className="text-xl font-semibold flex-1">Módulos</h2>
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={handleAddModulo}
          >
            Novo módulo
          </button>
          <button
            className="bg-green-400 text-white px-3 py-1 rounded ml-2"
            onClick={handleAddAula}
          >
            Nova aula
          </button>
        </div>
        <ul className="space-y-2">
          {conteudo.map((modulo) => (
            <li
              key={modulo.id}
              className={`border rounded p-3 ${
                moduloSelecionado === modulo.id
                  ? "border-green-500"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-semibold cursor-pointer"
                  onClick={() => setModuloSelecionado(modulo.id)}
                >
                  {modulo.nome}
                </span>
                <div className="space-x-2">
                  <button
                    className="text-blue-600"
                    onClick={() => handleEditModulo(modulo.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDeleteModulo(modulo.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
              {/* Lista de aulas do módulo selecionado */}
              {moduloSelecionado === modulo.id && (
                <div className="mt-4 ml-4">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-medium flex-1">Aulas</h3>
                  </div>
                  <ul className="space-y-1">
                    {modulo.aulas.map((aula) => (
                      <li
                        key={aula.id}
                        className={`border rounded p-2 ${
                          aulaSelecionada === aula.id
                            ? "border-green-400"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="cursor-pointer"
                            onClick={() => setAulaSelecionada(aula.id)}
                          >
                            {aula.titulo}
                          </span>
                          <div className="space-x-2">
                            <button
                              className="text-blue-600"
                              onClick={() => handleEditAula(modulo.id, aula.id)}
                            >
                              Editar
                            </button>
                            <button
                              className="text-red-600"
                              onClick={() =>
                                handleDeleteAula(modulo.id, aula.id)
                              }
                            >
                              Excluir
                            </button>
                            <button
                              className="text-gray-600"
                              onClick={() => {
                                const toModuloId = Number(
                                  prompt(
                                    "Mover para qual módulo? " +
                                      conteudo
                                        .filter((m) => m.id !== modulo.id)
                                        .map((m) => `\n${m.id}: ${m.nome}`)
                                        .join("")
                                  )
                                );
                                if (
                                  toModuloId &&
                                  conteudo.find((m) => m.id === toModuloId)
                                )
                                  handleMoveAula(
                                    modulo.id,
                                    aula.id,
                                    toModuloId
                                  );
                              }}
                            >
                              Mover
                            </button>
                          </div>
                        </div>
                        {/* Editor de aula */}
                        {aulaSelecionada === aula.id && (
                          <div className="mt-3 ml-3">
                            {/* Explicações */}
                            <div className="mb-4">
                              <div className="flex items-center mb-1">
                                <span className="font-semibold flex-1">
                                  Explicações
                                </span>
                                <button
                                  className="text-green-600"
                                  onClick={() =>
                                    handleAddExplicacao(modulo.id, aula.id)
                                  }
                                >
                                  + Explicação
                                </button>
                              </div>
                              <ul className="space-y-1">
                                {aula.explicacoes.map((exp, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center space-x-2"
                                  >
                                    <textarea
                                      className="border rounded p-1 flex-1"
                                      value={exp}
                                      onChange={(e) =>
                                        handleEditExplicacao(
                                          modulo.id,
                                          aula.id,
                                          idx,
                                          e.target.value
                                        )
                                      }
                                      rows={2}
                                    />
                                    <button
                                      className="text-red-500"
                                      onClick={() =>
                                        handleDeleteExplicacao(
                                          modulo.id,
                                          aula.id,
                                          idx
                                        )
                                      }
                                    >
                                      Excluir
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {/* Questões */}
                            <div>
                              <div className="flex items-center mb-1">
                                <span className="font-semibold flex-1">
                                  Questões
                                </span>
                                <button
                                  className="text-green-600"
                                  onClick={() =>
                                    handleAddQuestao(modulo.id, aula.id)
                                  }
                                >
                                  + Questão
                                </button>
                              </div>
                              <ul className="space-y-2">
                                {aula.questoes.map((q, qidx) => (
                                  <li key={q.id} className="border rounded p-2">
                                    <div className="mb-1">
                                      <input
                                        className="border rounded p-1 w-full mb-1"
                                        value={q.enunciado}
                                        onChange={(e) =>
                                          handleEditQuestao(
                                            modulo.id,
                                            aula.id,
                                            qidx,
                                            "enunciado",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enunciado da questão"
                                      />
                                    </div>
                                    <div className="mb-1">
                                      <span className="text-xs">Opções:</span>
                                      {q.opcoes.map((op, opidx) => (
                                        <div
                                          key={opidx}
                                          className="flex items-center space-x-2 mb-1"
                                        >
                                          <input
                                            className="border rounded p-1 flex-1"
                                            value={op}
                                            onChange={(e) =>
                                              handleEditQuestaoOpcao(
                                                modulo.id,
                                                aula.id,
                                                qidx,
                                                opidx,
                                                e.target.value
                                              )
                                            }
                                            placeholder={`Opção ${opidx + 1}`}
                                          />
                                          <input
                                            type="radio"
                                            name={`correta-${q.id}`}
                                            checked={q.correta === opidx}
                                            onChange={() =>
                                              handleEditQuestao(
                                                modulo.id,
                                                aula.id,
                                                qidx,
                                                "correta",
                                                opidx
                                              )
                                            }
                                          />
                                          <span className="text-xs">
                                            Correta
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="mb-1">
                                      <textarea
                                        className="border rounded p-1 w-full"
                                        value={q.explicacao}
                                        onChange={(e) =>
                                          handleEditQuestao(
                                            modulo.id,
                                            aula.id,
                                            qidx,
                                            "explicacao",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Explicação da resposta"
                                        rows={2}
                                      />
                                    </div>
                                    <button
                                      className="text-red-500"
                                      onClick={() =>
                                        handleDeleteQuestao(
                                          modulo.id,
                                          aula.id,
                                          qidx
                                        )
                                      }
                                    >
                                      Excluir questão
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminContentBuilder;
