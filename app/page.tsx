'use client';

import React, { useMemo, useState } from 'react';
import './globals.css';

type Op = '+' | '-' | '×' | '÷';
type Problem = { a: number; b: number; op: Op; result: number; display: string };

function randint(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function generateProblems(count: number, from: number, to: number, ops: Op[], onlyWholeDivision: boolean, noNegatives: boolean): Problem[] {
  const out: Problem[] = [];
  const safeMin = Math.min(from, to);
  const safeMax = Math.max(from, to);

  for (let i = 0; i < count; i++) {
    const op = pick(ops);
    let a = randint(safeMin, safeMax);
    let b = randint(safeMin, safeMax);
    let res = 0;

    if (op === '÷') {
      b = Math.max(1, b);
      if (onlyWholeDivision) {
        res = randint(safeMin, safeMax);
        a = res * b;
      } else {
        res = a / b;
      }
    }
    if (op === '×') res = a * b;
    if (op === '+') res = a + b;
    if (op === '-') {
      if (noNegatives && a - b < 0) { const t = a; a = b; b = t; }
      res = a - b;
    }
    const display = `${a} ${op} ${b} =`;
    out.push({ a, b, op, result: res, display });
  }
  return out;
}

export default function Page() {
  const [count, setCount] = useState(10);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(12);
  const [ops, setOps] = useState<Op[]>(['×','÷','+','-']);
  const [onlyWholeDivision, setOnlyWholeDivision] = useState(true);
  const [noNegatives, setNoNegatives] = useState(true);
  const [seed, setSeed] = useState(1);

  const [mode, setMode] = useState<'worksheet'|'test'>('worksheet');
  const problems = useMemo(() => generateProblems(count, from, to, ops, onlyWholeDivision, noNegatives), [count, from, to, ops, onlyWholeDivision, noNegatives, seed]);

  // test mode state
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState('');
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const currentProblem = problems[current];

  function checkAnswer() {
    if (!currentProblem) return;
    if (Number(answer) === currentProblem.result) {
      setCorrectCount(c => c+1);
      if (current+1 < problems.length) {
        setCurrent(c => c+1);
        setAnswer('');
      } else {
        setFinished(true);
      }
    }
  }

  return (
    <div className="container">
      <div className="card">

        {mode === 'worksheet' && (
          <>
            <h2>Generátor príkladov</h2>
            <div className="controls no-print">
              <div><label>Počet</label><input type="number" value={count} onChange={e=>setCount(Number(e.target.value))}/></div>
              <div><label>Od</label><input type="number" value={from} onChange={e=>setFrom(Number(e.target.value))}/></div>
              <div><label>Do</label><input type="number" value={to} onChange={e=>setTo(Number(e.target.value))}/></div>
            </div>
            <button onClick={()=>setSeed(s=>s+1)}>Vygenerovať</button>
            <button onClick={()=>setMode('test')}>Spustiť test</button>
            <div className="sheet" style={{marginTop:20}}>
              {problems.map((p,i)=>(
                <div key={i} className="problem">
                  <span>{i+1}. {p.display}</span>
                  <span className="answer">&nbsp;</span>
                </div>
              ))}
            </div>
          </>
        )}

        {mode === 'test' && (
          <>
            <h2>Test</h2>
            {finished ? (
              <div>
                <h3>Hotovo ✅</h3>
                <p>Správne: {correctCount} / {problems.length}</p>
                <button onClick={()=>{setMode('worksheet'); setFinished(false); setCurrent(0); setAnswer(''); setCorrectCount(0);}}>Späť</button>
              </div>
            ) : (
              <>
                <p><b>Príklad {current+1}/{problems.length}:</b></p>
                <div className="problem">
                  <span>{currentProblem.display}</span>
                  <input
                    type="number"
                    value={answer}
                    onChange={e=>setAnswer(e.target.value)}
                    style={{
                      border: (answer && Number(answer)!==currentProblem.result) ? '2px solid red' : '1px solid #ccc',
                      padding: '6px 10px',
                      borderRadius: 6,
                      width: 100
                    }}
                  />
                </div>
                <div style={{marginTop:10}}>
                  <button className="primary" onClick={checkAnswer}>Potvrdiť</button>
                </div>
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}
