export const conteudo = [
  {
    id: 1,
    nome: "Introdução",
    aulas: [
      {
        id: 1,
        titulo: "Aula 1",
        explicacoes: [
          "Bem-vindo à trilha de educação financeira! Aqui você aprenderá os conceitos fundamentais para controlar suas finanças.",
        ],
        questoes: [
          {
            id: 1,
            enunciado: "O que é educação financeira?",
            opcoes: [
              "a) Aprender a gastar mais",
              "b) Aprender a controlar e planejar o uso do dinheiro",
              "c) Guardar todo o dinheiro",
              "d) Não usar dinheiro",
              "e) Nenhuma das anteriores",
            ],
            correta: 1,
            explicacao:
              "Educação financeira é aprender a controlar e planejar o uso do dinheiro.",
          },
        ],
      },
      {
        id: 2,
        titulo: "Aula 2",
        explicacoes: [
          "Descubra como usar a plataforma ezDin para acompanhar seu progresso e aprender de forma eficiente.",
        ],
        questoes: [
          {
            id: 1,
            enunciado: "Qual a principal função do ezDin?",
            opcoes: [
              "a) Jogar",
              "b) Aprender e controlar finanças",
              "c) Comprar produtos",
              "d) Vender serviços",
              "e) Nenhuma das anteriores",
            ],
            correta: 1,
            explicacao: "O ezDin serve para aprender e controlar finanças.",
          },
        ],
      },
      {
        id: 3,
        titulo: "Aula 3",
        explicacoes: [
          "Nesta lição, você aprenderá sobre estruturas de controle condicionais (if, else, switch) e de repetição (for, while, do-while) em C.",
        ],
        questoes: [
          {
            id: 1,
            enunciado:
              "Qual estrutura de controle é usada para executar um bloco de código apenas se uma condição for verdadeira?",
            opcoes: ["a) for", "b) while", "c) if", "d) switch", "e) do-while"],
            correta: 2,
            explicacao:
              "A estrutura 'if' é usada para executar um bloco de código apenas quando uma condição específica é verdadeira.",
          },
        ],
      },
    ],
  },
];

export const getConteudo = () => {
  const saved = localStorage.getItem("conteudo");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // Se der erro, ignora e retorna o conteudo estático abaixo
    }
  }
  return conteudo;
};

export const isLessonComplete = (moduloId, aulaId) => {
  const key = `lesson-answers-${moduloId}-${aulaId}`;
  const saved = localStorage.getItem(key);
  if (!saved) return false;
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.every((a) => a !== null);
  } catch {
    return false;
  }
};
