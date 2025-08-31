'use client';

import React, { useMemo, useState } from 'react';
import './globals.css';

type Op = '+' | '-' | '×' | '÷';

type Problem = {
  a: number;
  b: number;
  op: Op;
  result: number;
  display: string;
};

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
      // Ensure divisor not zero and integer result if requested
      b = Math.max(1, b);
      if (onlyWholeDivision) {
        // make a multiple of b
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
  const [count, setCount] = useState(60);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(12);
  const [ops, setOps] = useState<Op[]>(['×', '÷', '+', '-']);
  const [onlyWholeDivision, setOnlyWholeDivision] = useState(true);
  const [noNegatives, setNoNegatives] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [seed, setSeed] = useState(1);

  const problems = useMemo(() => {
    // A simple deterministic seed with Math.random override would be overkill; instead, we change
    // the key so React recreates the list each time "seed" changes.
    return generateProblems(count, from, to, ops, onlyWholeDivision, noNegatives);
  }, [count, from, to, ops, onlyWholeDivision, noNegatives, seed]);

  function toggleOp(op: Op) {
    setOps(prev => prev.includes(op) ? prev.filter(o => o !== op) : [...prev, op]);
  }

  return (
    <div className="container">
      <div className="card">
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h1 style={{ margin: 0, fontSize: 22 }}>Generátor príkladov</h1>
          <div className="small">Vytvorené pre Ibn 👋</div>
        </div>

        <div className="controls no-print">
          <div>
            <label>Počet príkladov</label>
            <input type="number" min={1} max={500} value={count} onChange={(e)=>setCount(Number(e.target.value))}/>
          </div>
          <div>
            <label>Čísla od</label>
            <input type="number" value={from} onChange={(e)=>setFrom(Number(e.target.value))}/>
          </div>
          <div>
            <label>Čísla do</label>
            <input type="number" value={to} onChange={(e)=>setTo(Number(e.target.value))}/>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
            <label>Operácie</label>
            <div className="ops">
              {(['+','-','×','÷'] as Op[]).map(op => (
                <label key={op}><input type="checkbox" checked={ops.includes(op)} onChange={()=>toggleOp(op)} /> {op}</label>
              ))}
            </div>
          </div>
          <div className="toggle">
            <input id="whole" type="checkbox" checked={onlyWholeDivision} onChange={(e)=>setOnlyWholeDivision(e.target.checked)} />
            <label htmlFor="whole">Pri delení iba celé výsledky</label>
          </div>
          <div className="toggle">
            <input id="neg" type="checkbox" checked={noNegatives} onChange={(e)=>setNoNegatives(e.target.checked)} />
            <label htmlFor="neg">Bez záporných výsledkov pri odčítaní</label>
          </div>
        </div>

        <div className="no-print btns" style={{ marginBottom: 14 }}>
          <button className="primary" onClick={()=>setSeed(s => s + 1)}>Vygenerovať</button>
          <button className="ghost" onClick={()=>setShowKey(k => !k)}>{showKey ? 'Skryť výsledky' : 'Zobraziť výsledky'}</button>
          <button className="ghost" onClick={()=>window.print()}>Tlačiť / PDF</button>
        </div>

        <div className="sheet">
          {problems.map((p, i) => (
            <div key={i} className="problem">
              <span className="q">{i+1}. {p.display}</span>
              {showKey ? <span className="key">{p.result}</span> : <span className="answer">&nbsp;</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
