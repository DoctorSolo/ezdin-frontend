export const allLessons = [
  {
    id: 1,
    title: "Aula 1 - Linguagem de Programação C",
    explanation:
      "Nesta lição, você aprenderá sobre a linguagem C, compilação, funções, argumentos, ferramentas, comandos, operadores, estruturas condicionais, repetição, booleanos, abstração, header de arquivos, função main, memória, imprecisão e overflow.",
    questions: [
      {
        id: 1,
        statement:
          "Em uma época de intenso calor, um aparelho de ar-condicionado com potência de 1500W ficou ligado por mais tempo, chegando à marca mensal de consumo igual a 7500W.h. Determine por quanto tempo esse aparelho ficou ligado por dia.",
        options: ["a) 2h", "b) 4h", "c) 5h", "d) 6h", "e) 7,5h"],
        correct: 2,
        explanation:
          "Para encontrar o tempo diário, divida o consumo mensal (7500Wh) pela potência (1500W) para obter o total de horas no mês: 7500 / 1500 = 5h por dia.",
      },
      {
        id: 2,
        statement: "Qual é a função do header de arquivos em C?",
        options: [
          "a) Definir variáveis globais",
          "b) Incluir bibliotecas e definições",
          "c) Executar o programa principal",
          "d) Gerenciar memória",
          "e) Nenhuma das anteriores",
        ],
        correct: 1,
        explanation:
          "O header de arquivos em C serve para incluir bibliotecas e definições, permitindo o uso de funções e recursos externos.",
      },
    ],
  },
  {
    id: 2,
    title: "Aula 2 - Variáveis e Tipos de Dados",
    explanation:
      "Nesta lição, você aprenderá sobre variáveis, tipos de dados básicos em C, declaração, inicialização e operações com diferentes tipos de dados.",
    questions: [
      {
        id: 1,
        statement:
          "Qual é o tipo de dado usado para armazenar números inteiros em C?",
        options: ["a) float", "b) char", "c) int", "d) double", "e) string"],
        correct: 2,
        explanation:
          "O tipo 'int' é usado para armazenar números inteiros em C. É o tipo mais comum para variáveis que representam valores inteiros.",
      },
      {
        id: 2,
        statement: "Como se declara uma variável do tipo float em C?",
        options: [
          "a) float nome_variavel;",
          "b) int nome_variavel;",
          "c) char nome_variavel;",
          "d) double nome_variavel;",
          "e) string nome_variavel;",
        ],
        correct: 0,
        explanation:
          "Para declarar uma variável do tipo float, usa-se a sintaxe: float nome_variavel;",
      },
    ],
  },
  {
    id: 3,
    title: "Aula 3 - Estruturas de Controle",
    explanation:
      "Nesta lição, você aprenderá sobre estruturas de controle condicionais (if, else, switch) e de repetição (for, while, do-while) em C.",
    questions: [
      {
        id: 1,
        statement:
          "Qual estrutura de controle é usada para executar um bloco de código apenas se uma condição for verdadeira?",
        options: ["a) for", "b) while", "c) if", "d) switch", "e) do-while"],
        correct: 2,
        explanation:
          "A estrutura 'if' é usada para executar um bloco de código apenas quando uma condição específica é verdadeira.",
      },
    ],
  },
];
