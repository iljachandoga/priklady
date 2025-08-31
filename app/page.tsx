"use client";

import { useState } from "react";

type Operation = "addition" | "subtraction" | "multiplication" | "division";

interface Problem {
  a: number;
  b: number;
  op: Operation;
  correct: number;
  userAnswer: string;
  isCorrect: boolean | null;
}

function generateProblems(
  count: number,
  min: number,
  max: number,
  operations: Operation[]
): Problem[] {
  const problems: Problem[] = [];

  for (let i = 0; i < count; i++) {
    const op = operations[Math.floor(Math.random() * operations.length)];

    let a: number, b: number, correct: number;

    switch (op) {
      case "addition":
        a = Math.floor(Math.random() * (max - min + 1)) + min;
        b = Math.floor(Math.random() * (max - min + 1)) + min;
        correct = a + b;
        break;

      case "subtraction":
        // aby výsledok bol kladný
        a = Math.floor(Math.random() * (max - min + 1)) + min;
        b = Math.floor(Math.random() * (a - min + 1)) + min; // b <= a
        correct = a - b;
        break;

      case "multiplication":
        a = Math.floor(Math.random() * (max - min + 1)) + min;
        b = Math.floor(Math.random() * (max - min + 1)) + min;
        correct = a * b;
        break;

      case "division":
        correct = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * (max - min + 1)) + min;
        a = correct * b;
        break;
    }

    problems.push({
      a,
      b,
      op,
      correct,
      userAnswer: "",
      isCorrect: null,
    });
  }

  return problems;
}

export default function Page() {
  const [count, setCount] = useState(5);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(10);
  const [operations, setOperations] = useState<Operation[]>([
    "addition",
    "subtraction",
    "multiplication",
    "division",
  ]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const toggleOperation = (op: Operation) => {
    setOperations((prev) =>
      prev.includes(op) ? prev.filter((o) => o !== op) : [...prev, op]
    );
  };

  const startTest = () => {
    if (operations.length === 0) {
      alert("Vyber aspoň jednu operáciu!");
      return;
    }
    const newProblems = generateProblems(count, min, max, operations);
    setProblems(newProblems);
    setFinished(false);
    setEndTime(null);
    setStartTime(Date.now());
  };

  const handleAnswer = (index: number, value: string) => {
    setProblems((prev) => {
      const updated = [...prev];
      const problem = updated[index];
      problem.userAnswer = value;

      if (value === "") {
        problem.isCorrect = null;
      } else if (parseInt(value) === problem.correct) {
        problem.isCorrect = true;
      } else {
        problem.isCorrect = false;
      }

      return updated;
    });
  };

  const allCorrect = problems.every((p) => p.isCorrect === true);

  const finishTest = () => {
    setEndTime(Date.now());
    setFinished(true);
  };

  const getDuration = () => {
    if (!startTime || !endTime) return "";
    const seconds = Math.floor((endTime - startTime) / 1000);
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min} min ${sec} s`;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Matematický test</h1>

      <div className="mb-6 p-4 border rounded">
        <label className="block mb-2">
          Počet príkladov:
          <input
            type="number"
            value={count}
            min={1}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="border p-1 ml-2 w-20"
          />
        </label>

        <label className="block mb-2">
          Rozsah čísel:
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(parseInt(e.target.value))}
            className="border p-1 ml-2 w-20"
          />
          do
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
            />{" "}
            +
          </label>
          <label className="ml-2">
            <input
              type="checkbox"
              checked={operations.includes("subtraction")}
              onChange={() => toggleOperation("subtraction")}
            />{" "}
            -
          </label>
          <label className="ml-2">
            <input
              type="checkbox"
              checked={operations.includes("multiplication")}
              onChange={() => toggleOperation("multiplication")}
            />{" "}
            ×
          </label>
          <label className="ml-2">
            <input
              type="checkbox"
              checked={operations.includes("division")}
              onChange={() => toggleOperation("division")}
            />{" "}
            ÷
          </label>
        </div>

        <button
          onClick={startTest}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Generovať príklady
        </button>
      </div>

      {problems.length > 0 && (
        <div>
          {problems.map((p, i) => (
            <div key={i} className="mb-3">
              <span className="mr-2">
                {p.a}{" "}
                {p.op === "addition"
                  ? "+"
                  : p.op === "subtraction"
                  ? "-"
                  : p.op === "multiplication"
                  ? "×"
                  : "÷"}{" "}
                {p.b} =
              </span>
              <input
                type="number"
                value={p.userAnswer}
                onChange={(e) => handleAnswer(i, e.target.value)}
                className={`border p-1 w-24 ${
                  p.isCorrect === true
                    ? "border-green-500 text-green-600"
                    : p.isCorrect === false
                    ? "border-red-500 text-red-600"
                    : ""
                }`}
              />
              {p.isCorrect === false && (
                <span className="ml-2 text-red-600">Skús znova</span>
              )}
              {p.isCorrect === true && <span className="ml-2 text-green-600">✔️</span>}
            </div>
          ))}

          {allCorrect && !finished && (
            <button
              onClick={finishTest}
              className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            >
              Vyhodnotiť test
            </button>
          )}

          {finished && (
            <div className="mt-4 p-4 border rounded bg-gray-50">
              <p>
                ✅ Správne výsledky: {problems.filter((p) => p.isCorrect).length} z{" "}
                {problems.length} (
                {(
                  (problems.filter((p) => p.isCorrect).length / problems.length) *
                  100
                ).toFixed(0)}
                %)
              </p>
              <p>⏱️ Čas: {getDuration()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
