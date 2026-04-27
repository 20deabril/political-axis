"use client";

import { useState } from "react";

export default function PoliticalAxisQuiz() {
  const questions = [
    "Em molesta que els plans canviïn a última hora.",
    "Improviso fàcilment quan cal.",
    "Les normes ajuden a evitar problemes.",
    "M’agrada provar coses noves encara que surtin malament.",
    "M’agrada tenir les coses organitzades.",
    "No em preocupa gaire el desordre si tot acaba funcionant.",
    "Prefereixo estabilitat abans que risc.",
    "Actuo sovint per impuls.",
    "Si puc sortir-ne benefici, busco la millor jugada.",
    "Confio en la bona fe de la gent.",
    "Quan algú em falla, no ho oblido fàcilment.",
    "Sovint peco d’innocent en algunes situacions.",
    "Crec que de vegades cal ser pragmàtic encara que no agradi.",
    "Prenc decisions ràpides que després revisaria.",
    "Sé trobar el punt feble d’algú en una discussió.",
    "A vegades faig coses sense pensar-les prou.",
    "M’agrada planificar amb temps.",
    "Canvio d’opinió fàcilment si apareix una opció millor.",
    "Si puc evitar conflictes, ho intento.",
    "A vegades faig bromes o accions que compliquen situacions."
  ];

  const [answers, setAnswers] = useState<number[]>(Array(20).fill(3));

  const [result, setResult] = useState<{
    ordre: number;
    fdp: number;
  } | null>(null);

  const updateAnswer = (index: number, value: number) => {
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
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

  const getDescription = () => {
    if (!result) return "";

    if (result.ordre >= 0 && result.fdp >= 0)
      return "Estrateg fred: estructurat, calculador i implacable.";

    if (result.ordre >= 0 && result.fdp < 0)
      return "Buròcrata del caos contingut: organitzat però innocent.";

    if (result.ordre < 0 && result.fdp >= 0)
      return "Agent desestabilitzador: imprevisible i perillós.";

    return "Força de la natura: caos pur amb bona fe dubtosa.";
  };

  const getMapPosition = () => {
    if (!result) return { x: 50, y: 50 };

    const x = Math.max(0, Math.min(100, 50 + result.fdp * 5));
    const y = Math.max(0, Math.min(100, 50 - result.ordre * 5));

    return { x, y };
  };

  const shareResult = async () => {
    const text = `He fet el Political Axis de la vida i el meu resultat és: ${getQuadrant()} — ${getDescription()}`;

    await navigator.clipboard.writeText(text);

    alert("Resultat copiat al porta-retalls!");
  };

  const point = getMapPosition();

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold text-center">
          Political Axis de la vida
        </h1>

        <p className="text-zinc-400 text-center">
          Respon de 1 (gens d’acord) a 5 (molt d’acord)
        </p>

        {questions.map((q, i) => (
          <div
            key={i}
            className="bg-zinc-900 rounded-2xl p-4 shadow"
          >
            <p className="mb-3 text-sm md:text-base">
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

            <p className="text-sm text-zinc-400 mt-2">
              Resposta: {answers[i]}
            </p>
          </div>
        ))}

        <button
          onClick={calculate}
          className="w-full px-6 py-4 rounded-2xl bg-white text-black font-semibold text-lg"
        >
          Calcula resultat
        </button>

        {result && (
          <>
            <div className="bg-zinc-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-2xl font-bold">Resultat</h2>

              <p>Eix Ordre/Caos: {result.ordre}</p>
              <p>Eix Fill de puta/Gilipolles: {result.fdp}</p>

              <p className="text-xl font-semibold">
                {getQuadrant()}
              </p>

              <p className="text-zinc-300 italic">
                {getDescription()}
              </p>

              <button
                onClick={shareResult}
                className="mt-4 px-5 py-3 rounded-xl bg-white text-black font-semibold"
              >
                Compartir resultat
              </button>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-8 md:p-16">
              <h2 className="text-2xl font-bold mb-8 text-center">
                Mapa 2D
              </h2>

              <div className="relative w-full aspect-square border-4 border-zinc-300 rounded-xl">
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

                <div className="absolute -left-24 md:-left-40 top-1/2 -translate-y-1/2 font-bold text-white text-sm md:text-2xl whitespace-nowrap">
                  Fill de puta
                </div>

                <div className="absolute -right-20 md:-right-36 top-1/2 -translate-y-1/2 font-bold text-white text-sm md:text-2xl whitespace-nowrap">
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