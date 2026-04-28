"use client";

import { useState, useRef } from "react";

type AxisType = "ordre" | "caos" | "fdp" | "gili";

type Question = {
  text: string;
  type: AxisType;
};

const questionBank: Record<AxisType, string[]> = {
  ordre: [
    "Quan organitzo alguna cosa, prefereixo tenir-ho tot lligat.",
    "M’incomoda no saber què passarà després.",
    "Acostumo a anticipar problemes abans que apareguin.",
    "Abans de prendre decisions importants, intento contrastar opcions amb persones de confiança.",
    "M’agrada tenir rutines estables.",
    "Em tranquil·litza saber exactament què he de fer.",
    "Prefereixo acabar una cosa abans de començar-ne una altra.",
    "Em costa concentrar-me si tot al meu voltant està desordenat.",
    "Quan prenc una decisió important, acostumo a repassar totes les opcions.",
    "Si no tinc una idea clara de com començar, em costa arrencar."
  ],
  caos: [
    "Si un pla es complica, acostumo a adaptar-me ràpid.",
    "Improvisar em sembla estimulant.",
    "M’agrada deixar marge perquè les coses passin soles.",
    "Prenc decisions importants bastant ràpid.",
    "Canviar de direcció no em costa gaire.",
    "Sovint començo coses sense tenir gaire clar on acabaran.",
    "Quan apareix una oportunitat inesperada, m’agrada seguir-la.",
    "M’avorreixen els plans massa tancats.",
    "Si una idea em motiva, prefereixo provar-la abans de pensar-la massa.",
    "No em preocupa gaire haver d’improvisar sobre la marxa."
  ],
  fdp: [
    "Si hi ha una oportunitat clara, la sé aprofitar.",
    "Quan algú em decep, ho tinc molt present.",
    "En una negociació, intento sortir-ne millor que l’altra part.",
    "Si puc guanyar-hi alguna cosa, acostumo a buscar la manera.",
    "Quan hi ha molt en joc, acostumo a mirar primer per mi.",
    "Hi ha persones que només reaccionen si els apretes una mica.",
    "Si ningú està movent fitxa, no tinc problema a fer-ho jo.",
    "Quan veig que una situació es pot inclinar, intento ser qui la decanti.",
    "Si tinc clar què vull, em costa deixar que els altres marquin el ritme.",
    "Quan sento que algú m’està portant cap on vol, intento recuperar el control."
  ],
  gili: [
    "Prefereixo confiar abans que sospitar.",
    "Tinc tendència a donar segones oportunitats.",
    "Em costa dir que no quan algú em demana alguna cosa.",
    "Evito tensions encara que tingui raó.",
    "Em sap greu posar algú en una situació incòmoda.",
    "Quan una situació es complica, sovint prefereixo adaptar-me jo abans que forçar els altres.",
    "Quan algú falla, tendeixo a pensar que tenia els seus motius.",
    "Sovint prefereixo assumir el desgast jo abans que allargar un conflicte.",
    "Prefereixo mantenir una bona relació encara que això em costi alguna cosa.",
    "Quan hi ha tensió, acostumo a buscar la manera de rebaixar-la."
  ]
};

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function buildQuiz(total: number): Question[] {
  let distribution: Record<AxisType, number>;

  if (total === 20) {
    distribution = {
      ordre: 5,
      caos: 5,
      fdp: 5,
      gili: 5
    };
  } else if (total === 30) {
    distribution = {
      ordre: 8,
      caos: 7,
      fdp: 8,
      gili: 7
    };
  } else {
    distribution = {
      ordre: 10,
      caos: 10,
      fdp: 10,
      gili: 10
    };
  }

  const selected: Question[] = [];

  (Object.keys(distribution) as AxisType[]).forEach((type) => {
    const amount = distribution[type];

    const picked = shuffle(questionBank[type])
      .slice(0, amount)
      .map((text) => ({
        text,
        type
      }));

    selected.push(...picked);
  });

  return shuffle(selected);
}

export default function PoliticalAxisQuiz() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [answered, setAnswered] = useState<boolean[]>([]);
  const [result, setResult] = useState<{
    ordre: number;
    fdp: number;
  } | null>(null);

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const startQuiz = (amount: number) => {
    const generated = buildQuiz(amount);

    setQuestions(generated);
    setAnswers(Array(amount).fill(3));
    setAnswered(Array(amount).fill(false));
    setResult(null);
    setQuizStarted(true);
  };

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
    let ordre = 0;
    let fdp = 0;

    questions.forEach((question, index) => {
      const value = answers[index] - 3;

      if (question.type === "ordre") ordre += value;
      if (question.type === "caos") ordre -= value;

      if (question.type === "fdp") fdp += value;
      if (question.type === "gili") fdp -= value;
    });

    setResult({ ordre, fdp });
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuestions([]);
    setAnswers([]);
    setAnswered([]);
    setResult(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const answeredQuestions = answered.filter(Boolean).length;
  const progress =
    questions.length > 0
      ? (answeredQuestions / questions.length) * 100
      : 0;

  const allAnswered =
    questions.length > 0 &&
    answeredQuestions === questions.length;

  const point = result
    ? {
        x: Math.max(0, Math.min(100, 50 - result.fdp * 4)),
        y: Math.max(0, Math.min(100, 50 - result.ordre * 4))
      }
    : { x: 50, y: 50 };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-xl w-full text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold">
            Political Axis de la vida
          </h1>

          <p className="text-zinc-400 text-lg">
            Quantes preguntes vols?
          </p>

 <div className="space-y-4">
  <button
    onClick={() => startQuiz(20)}
    className="w-full p-5 rounded-2xl bg-zinc-200 text-black font-semibold text-lg cursor-pointer transition-all duration-200 hover:bg-white hover:scale-[1.02] active:scale-[0.98] active:bg-zinc-300"
  >
    20 (ràpid)
  </button>

  <button
    onClick={() => startQuiz(30)}
    className="w-full p-5 rounded-2xl bg-zinc-200 text-black font-semibold text-lg cursor-pointer transition-all duration-200 hover:bg-white hover:scale-[1.02] active:scale-[0.98] active:bg-zinc-300"
  >
    30 (normal)
  </button>

  <button
    onClick={() => startQuiz(40)}
    className="w-full p-5 rounded-2xl bg-zinc-200 text-black font-semibold text-lg cursor-pointer transition-all duration-200 hover:bg-white hover:scale-[1.02] active:scale-[0.98] active:bg-zinc-300"
  >
    40 (profund)
  </button>
</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 md:p-8">
      <div className="sticky top-0 z-50 bg-zinc-800 border-b border-zinc-700 shadow-xl py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold text-center">
            Political Axis de la vida
          </h1>

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
        {questions.map((question, i) => (
          <div
            key={i}
            ref={(el) => {
              questionRefs.current[i] = el;
            }}
            className="bg-zinc-900 rounded-2xl p-4 shadow"
          >
            <p className="mb-4 text-sm md:text-base">
              {i + 1}. {question.text}
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
            className={`w-full px-6 py-4 rounded-2xl font-semibold text-lg ${
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
          <div className="bg-zinc-900 rounded-2xl p-12 md:p-20">
            <h2 className="text-2xl font-bold mb-20 text-center">
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

              <div className="absolute -top-14 left-1/2 -translate-x-1/2 font-bold">
                Ordre
              </div>

              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 font-bold">
                Caos
              </div>

              <div className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90 font-bold whitespace-nowrap">
                Fill de puta
              </div>

              <div className="absolute -right-20 top-1/2 -translate-y-1/2 rotate-90 font-bold whitespace-nowrap">
                Gilipolles
              </div>

              <div
                className="absolute w-6 h-6 rounded-full bg-white border-4 border-black z-10"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: "translate(-50%, -50%)"
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}