"use client";

import { useState, useRef } from "react";

export default function PoliticalAxisQuiz() {
  const questions = [
    "Quan organitzo alguna cosa, prefereixo tenir-ho tot lligat.",
    "Si un pla es complica, acostumo a adaptar-me ràpid.",
    "M’incomoda no saber què passarà després.",
    "Improvisar em sembla estimulant.",
    "Acostumo a anticipar problemes abans que apareguin.",
    "M’agrada deixar marge perquè les coses passin soles.",
    "Quan hi ha caos, intento posar ordre.",
    "Prenc decisions importants bastant ràpid.",
    "Si hi ha una oportunitat clara, la sé aprofitar.",
    "Prefereixo confiar abans que sospitar.",
    "Quan algú em decep, ho tinc molt present.",
    "Tinc tendència a donar segones oportunitats.",
    "En una negociació, acostumo a pensar en avantatges mutus.",
    "Si puc guanyar-hi alguna cosa, acostumo a buscar la manera.",
    "Em fixo fàcilment en les contradiccions dels altres.",
    "A vegades reacciono abans de pensar-ho del tot.",
    "M’agrada tenir rutines estables.",
    "Canviar de direcció no em costa gaire.",
    "Evito tensions encara que tingui raó.",
    "Hi ha moments en què cal fer el que convé, no el que queda bé."
  ];

  const [answers, setAnswers] = useState<number[]>(Array(20).fill(3));
  const [answered, setAnswered] = useState<boolean[]>(
    Array(20).fill(false)
  );

  const [result, setResult] = useState<{
    ordre: number;
    fdp: number;
  } | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const updateAnswer = (index: number, value: number) => {
    const nextAnswers = [...answers];
    nextAnswers[index] = value;
    setAnswers(nextAnswers);

    const nextAnswered = [...answered];
    nextAnswered[index] = true;
    setAnswered(nextAnswered);

    const nextQuestion = questionRefs.current[index + 1];

    if (nextQuestion) {
      nextQuestion.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  };

  const calculate = () => {
    const ordre =
      (answers[0] + answers[2] + answers[4] + answers[6] + answers[16]) -
      (answers[1] + answers[3] + answers[5] + answers[7] + answers[17]);

    const fdp =
      (answers[8] + answers[10] + answers[12] + answers[14] + answers[18]) -
      (answers[9] + answers[11] + answers[13] + answers[15] + answers[19]);

    setResult({ ordre, fdp });
  };

  const resetQuiz = () => {
    setAnswers(Array(20).fill(3));
    setAnswered(Array(20).fill(false));
    setResult(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const getQuadrant = () => {
    if (!result) return "";

    if (result.ordre >= 0 && result.fdp >= 0)
      return "Ordre + Fill de puta";

    if (result.ordre >= 0 && result.fdp < 0)
      return "Ordre + Gilipolles";

    if (result.ordre < 0 && result.fdp >= 0)
      return "Caos + Fill de puta";

    return "Caos + Gilipolles";
  };

  const getMapPosition = () => {
    if (!result) return { x: 50, y: 50 };

    const x = Math.max(0, Math.min(100, 50 + result.fdp * 5));
    const y = Math.max(0, Math.min(100, 50 - result.ordre * 5));

    return { x, y };
  };

  const answeredQuestions = answered.filter(Boolean).length;
  const progress = (answeredQuestions / questions.length) * 100;
  const allAnswered = answeredQuestions === questions.length;

  const point = getMapPosition();

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 md:p-8">
      <div className="sticky top-0 z-50 bg-zinc-800 border-b border-zinc-700 shadow-xl py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold text-center">
            Political Axis de la vida
          </h1>

          <p className="text-zinc-300 text-center text-lg">
            Respon de 1 (gens d’acord) a 5 (molt d’acord)
          </p>

          <div className="space-y-3">
            <div className="flex justify-between text-sm text-zinc-300">
              <span>Progrés</span>
              <span>
                {answeredQuestions}/{questions.length}
              </span>
            </div>

            <div className="w-full bg-zinc-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 mt-8">
        {questions.map((q, i) => (
          <div
            key={i}
            ref={(el) => {
              questionRefs.current[i] = el;
            }}
            className="bg-zinc-900 rounded-2xl p-4 shadow"
          >
            <p className="mb-4 text-sm md:text-base">
              {i + 1}. {q}
            </p>

            <input
              type="range"
              min="1"
              max="5"
              value={answers[i]}
              onChange={(e) =>
                updateAnswer(i, Number(e.target.value))
              }
              className="w-full"
            />

            <div className="flex justify-between text-xs text-zinc-400 mt-2 px-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
        ))}

        <div className="flex gap-4 flex-col md:flex-row">
          <button
            onClick={calculate}
            disabled={!allAnswered}
            className={`w-full px-6 py-4 rounded-2xl font-semibold text-lg transition ${
              allAnswered
                ? "bg-white text-black"
                : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
            }`}
          >
            Calcula resultat
          </button>

          <button
            onClick={resetQuiz}
            className="w-full px-6 py-4 rounded-2xl bg-zinc-700 text-white font-semibold text-lg"
          >
            Reinicia test
          </button>
        </div>

        {result && (
          <>
            <div className="bg-zinc-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-2xl font-bold">Resultat</h2>

              <p>Eix Ordre/Caos: {result.ordre}</p>
              <p>Eix Fill de puta/Gilipolles: {result.fdp}</p>

              <p className="text-xl font-semibold">
                {getQuadrant()}
              </p>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-12 md:p-20">
              <h2 className="text-2xl font-bold mb-20 text-center">
                Mapa 2D
              </h2>

              <div
                ref={mapRef}
                className="relative w-full aspect-square border-4 border-zinc-300 rounded-xl"
              >
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                  <div className="bg-red-400" />
                  <div className="bg-blue-400" />
                  <div className="bg-green-400" />
                  <div className="bg-purple-400" />
                </div>

                <div className="absolute top-1/2 left-0 w-full h-1 bg-black" />
                <div className="absolute left-1/2 top-0 h-full w-1 bg-black" />

                <div className="absolute -top-14 left-1/2 -translate-x-1/2 font-bold text-white text-lg md:text-2xl">
                  Ordre
                </div>

                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 font-bold text-white text-lg md:text-2xl">
                  Caos
                </div>

                <div className="absolute -left-16 md:-left-24 top-1/2 -translate-y-1/2 -rotate-90 font-bold text-white text-sm md:text-xl whitespace-nowrap">
                  Fill de puta
                </div>

                <div className="absolute -right-16 md:-right-24 top-1/2 -translate-y-1/2 rotate-90 font-bold text-white text-sm md:text-xl whitespace-nowrap">
                  Gilipolles
                </div>

                <div
                  className="absolute w-6 h-6 rounded-full bg-white border-4 border-black z-10 transition-all duration-700 ease-out"
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}