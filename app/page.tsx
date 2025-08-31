"use client";
import { useState } from "react";

type Operation = "addition" | "subtraction" | "multiplication" | "division";

interface Problem {
  a: number;
  b: number;
  op: Operation;
  answer: number;
  userAnswer: string;
  correct: boolean | null;
}

export default function Page() {
  const [count, setCount] = useState(5);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(10);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [finished, setFinished] = useState(false);

  const toggleOperation = (op: Operation) => {
    setOperations((prev) =>
      prev.includes(op) ? prev.filter((o) => o !== op) : [...prev, op]
    );
  };

  const generateProblems = () => {
    if (operations.length === 0) {
      alert("Vyber aspoň jednu operáciu!");
      return;
    }
    const newProblems: Problem[] = [];
    for (let i = 0; i < count; i++) {
      const op = operations[Math.floor(Math.random() * operations.length)];
      const a = Math.floor(Math.random() * (max - min + 1)) + min;
      const b = Math.floor(Math.random() * (max - min + 1)) + min;

      let answer = 0;
      switch (op) {
        case "addition":
          answer = a + b;
          break;
        case "subtraction":
          answer = a - b;
          break;
        case "multiplication":
          answer = a * b;
          break;
        case "division":
          answer = Math.floor(a / b); // celočíselné delenie
          break;
      }
      newProblems.push({ a, b, op, answer, userAnswer: "", correct: null });
    }
    setProblems(newProblems);
    setFinished(false);
  };

  const checkAnswer = (index: number, value: string) => {
    setProblems((prev) => {
      const updated = [...prev];
      const problem = updated[index];
      problem.userAnswer = value;
      if (value === "") {
        problem.correct = null;
      } else {
        problem.correct = parseInt(value) === problem.answer;
      }
      return updated;
    });
  };

  const allCorrect = problems.every((p) => p.correct === true);

  const finishTest = () => {
    if (!allCorrect) {
      alert("Musíš vyriešiť všetky príklady správne!");
      return;
    }
    setFinished(true);
  };

  const renderOp = (op: Operation) => {
    switch (op) {
      case "addition":
        return "+";
      case "subtraction":
        return "-";
      case "multiplication":
        return "×";
      case "division":
        return "÷";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Matematický test</h1>

      {/* Formulár na nastavenie */}
      <div className="bg-white shadow p-4 rounded-xl mb-6 w-full max-w-md">
        <label className="block mb-2">
          Počet príkladov:
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="border p-1 ml-2 w-20"
          />
        </label>

        <label className="block mb-2">
          Od:
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(parseInt(e.target.value))}
            className="border p-1 ml-2 w-20"
          />
        </label>

        <label className="block mb-2">
          Do:
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(parseInt(e.target.value))}
            className="border p-1 ml-2 w-20"
          />
        </label>

        <div className="mb-2">
          Operácie:
          <label className="ml-2">
            <input
              type="checkbox"
              checked={operations.includes("addition")}
              onChange={() => toggleOperation("addition")}
            />
            ➕
          </label>
          <label className="ml-2">
            <input
              type="checkbox"
              checked={operations.includes("subtraction")}
              onChange={() => toggleOperation("subtraction")}
            />
            ➖
          </label>
          <label className="ml-2">
            <input
              type="checkbox"
              checked={operations.includes("multiplication")}
              onChange={() => toggleOperation("multiplication")}
            />
            ✖️
          </label>
          <label className="ml-2">
            <input
              type="checkbox"
              checked={operations.includes("division")}
              onChange={() => toggleOperation("division")}
            />
            ➗
          </label>
        </div>

        <button
          onClick={generateProblems}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Generovať
        </button>
      </div>

      {/* Test */}
      {problems.length > 0 && (
        <div className="bg-white shadow p-4 rounded-xl w-full max-w-md">
          {problems.map((p, i) => (
            <div key={i} className="mb-3">
              <span className="mr-2">
                {p.a} {renderOp(p.op)} {p.b} =
              </span>
              <input
                type="number"
                value={p.userAnswer}
                onChange={(e) => checkAnswer(i, e.target.value)}
                className={`border p-1 w-24 ${
                  p.correct === null
                    ? ""
                    : p.correct
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              />
            </div>
          ))}

          {!finished && (
            <button
              onClick={finishTest}
              disabled={!allCorrect}
              className={`px-4 py-2 rounded ${
                allCorrect
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Dokončiť test
            </button>
          )}

          {finished && (
            <div className="mt-4 text-green-600 font-bold">
              🎉 Všetky príklady vyriešené správne!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
