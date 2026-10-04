import { useEffect, useMemo, useRef, useState } from 'react';
import loadMujoco from '@mujoco/mujoco';
import {
  DEFAULT_PARAMS,
  buildXml,
  classify,
  crankRange,
  crankTarget,
  initialQpos,
  solve,
  startAngle,
  transmissionAngle,
} from './fourbar.js';

const PRESETS = {
  曲柄搖桿: DEFAULT_PARAMS,
  雙曲柄: { ...DEFAULT_PARAMS, a: 0.08, b: 0.2, c: 0.25, d: 0.22 },
  雙搖桿: { ...DEFAULT_PARAMS, a: 0.3, b: 0.22, c: 0.12, d: 0.25, px: 0.06, py: 0.05 },
  三搖桿: { ...DEFAULT_PARAMS, a: 0.3, b: 0.2, c: 0.2, d: 0.28 },
};

const SLIDERS = [
  { key: 'a', label: '固定桿 a', min: 0.05, max: 0.5 },
  { key: 'b', label: '曲柄 b', min: 0.03, max: 0.4 },
  { key: 'c', label: '連桿 c', min: 0.05, max: 0.5 },
  { key: 'd', label: '搖桿 d', min: 0.05, max: 0.5 },
  { key: 'px', label: '描點 P（沿連桿）', min: -0.2, max: 0.5 },
  { key: 'py', label: '描點 P（垂直連桿）', min: -0.2, max: 0.2 },
];

const deg = (r) => (r * 180) / Math.PI;
const HISTORY_SECONDS = 6;
const TRACE_POINTS = 1500;

function useMujoco() {
  const [state, setState] = useState({ mj: null, error: null });
  useEffect(() => {
    let alive = true;
    loadMujoco()
      .then((mj) => alive && setState({ mj, error: null }))
      .catch((e) => alive && setState({ mj: null, error: String(e?.message ?? e) }));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

/** 取樣整個可動範圍的解析解：用來畫理論軌跡並決定畫面縮放 */
function sampleAnalytic(params, range) {
  if (!range.possible) return { path: [], bounds: null };
  const n = 360;
  const lo = range.full ? 0 : range.min + 0.03;
  const hi = range.full ? 2 * Math.PI : range.max - 0.03;
  const path = [];
  const pts = [[0, 0], [params.a, 0]];
  for (let i = 0; i <= n; i++) {
    const s = solve(params, lo + ((hi - lo) * i) / n);
    if (!s) continue;
    path.push(s.P);
    pts.push(s.A, s.B, s.P);
  }
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return {
    path,
    bounds: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) },
  };
}

function cssVar(el, name) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

export default function App() {
  const { mj, error: loadError } = useMujoco();
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(0.5); // 曲柄每秒圈數
  const [showTrace, setShowTrace] = useState(true);
  const [showXml, setShowXml] = useState(false);
  const [readout, setReadout] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const info = useMemo(() => classify(params), [params]);
  const range = useMemo(() => crankRange(params), [params]);
  const analytic = useMemo(() => sampleAnalytic(params, range), [params, range]);
  const xml = useMemo(() => buildXml(params), [params]);

  const mechCanvas = useRef(null);
  const chartCanvas = useRef(null);
  const sim = useRef(null);
  const ui = useRef({ playing, speed, showTrace });
  ui.current = { playing, speed, showTrace };

  // 參數改變或按「重設」時重建 MuJoCo 模型
  useEffect(() => {
    if (!mj || !range.possible) {
      sim.current = null;
      return;
    }
    let model;
    let data;
    try {
      model = mj.MjModel.from_xml_string(xml);
      data = new mj.MjData(model);
    } catch (e) {
      setReadout({ error: `MuJoCo 模型建立失敗：${e?.message ?? e}` });
      return;
    }
    const SITE = mj.mjtObj.mjOBJ_SITE.value;
    const id = (n) => mj.mj_name2id(model, SITE, n);
    const q0 = initialQpos(params, startAngle(range));
    data.qpos[0] = q0.crank;
    data.qpos[1] = q0.coupler;
    data.qpos[2] = q0.rocker;
    data.ctrl[0] = q0.crank;
    mj.mj_forward(model, data);

    sim.current = {
      model,
      data,
      ids: { O2: id('O2'), O4: id('O4'), A: id('A'), B: id('B_coupler'), Br: id('B_rocker'), P: id('P') },
      trace: [],
      history: [],
      driveTime: 0,
    };
    return () => {
      sim.current = null;
      data.delete();
      model.delete();
    };
  }, [mj, xml, range, params, resetKey]);

  // 動畫迴圈：推進模擬並繪圖
  useEffect(() => {
    let raf;
    let last = performance.now();
    let lastReadout = 0;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dtWall = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = sim.current;
      if (!s || !mj) return;
      const { model, data, ids } = s;
      const omega = 2 * Math.PI * ui.current.speed;

      if (ui.current.playing) {
        // driveTime 以「圈」為單位累積，改變速度時曲柄不會跳動
        const steps = Math.round(dtWall / model.opt.timestep);
        for (let i = 0; i < steps; i++) {
          s.driveTime += model.opt.timestep * omega;
          data.ctrl[0] = crankTarget(range, s.driveTime, 1);
          mj.mj_step(model, data);
        }
      }

      const x = data.site_xpos;
      const pt = (i) => [x[3 * i], x[3 * i + 2]];
      const P = { O2: pt(ids.O2), O4: pt(ids.O4), A: pt(ids.A), B: pt(ids.B), Br: pt(ids.Br), P: pt(ids.P) };

      if (ui.current.playing) {
        s.trace.push(P.P);
        if (s.trace.length > TRACE_POINTS) s.trace.shift();
        const th3 = Math.atan2(P.B[1] - P.A[1], P.B[0] - P.A[0]);
        const th4 = Math.atan2(P.Br[1] - P.O4[1], P.Br[0] - P.O4[0]);
        s.history.push({ t: data.time, th4: deg(th4), mu: deg(transmissionAngle(th3, th4)) });
        while (s.history.length && data.time - s.history[0].t > HISTORY_SECONDS) s.history.shift();
      }

      drawMechanism(mechCanvas.current, P, s.trace, analytic, ui.current.showTrace);
      drawChart(chartCanvas.current, s.history);

      if (now - lastReadout > 100) {
        lastReadout = now;
        const th2 = Math.atan2(P.A[1], P.A[0]);
        const th3 = Math.atan2(P.B[1] - P.A[1], P.B[0] - P.A[0]);
        const th4 = Math.atan2(P.Br[1] - P.O4[1], P.Br[0] - P.O4[0]);
        // site_xpos 是上一步積分前的位置，所以用 A 點反推的曲柄角來比對，而不是 qpos
        const exact = solve(params, th2);
        setReadout({
          time: data.time,
          th2: deg(th2),
          th3: deg(th3),
          th4: deg(th4),
          mu: deg(transmissionAngle(th3, th4)),
          gap: Math.hypot(P.B[0] - P.Br[0], P.B[1] - P.Br[1]) * 1000,
          err: exact ? Math.hypot(P.P[0] - exact.P[0], P.P[1] - exact.P[1]) * 1000 : null,
        });
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [mj, range, analytic, params]);

  const setParam = (key, value) => setParams((p) => ({ ...p, [key]: value }));

  return (
    <div className="app">
      <header>
        <h1>四連桿機構運動學模擬器</h1>
        <p className="sub">React + MuJoCo（WebAssembly）｜在瀏覽器中求解封閉迴路約束</p>
      </header>

      <main>
        <section className="stage">
          <div className="canvas-wrap">
            <canvas ref={mechCanvas} aria-label="四連桿機構動畫" />
            {!mj && !loadError && <div className="overlay">正在載入 MuJoCo WebAssembly…</div>}
            {loadError && <div className="overlay error">MuJoCo 載入失敗：{loadError}</div>}
            {mj && !range.possible && (
              <div className="overlay error">這組桿長無法組裝：任何曲柄角度下連桿與搖桿都接不起來。</div>
            )}
          </div>
          <div className="toolbar">
            <button onClick={() => setPlaying((v) => !v)}>{playing ? '⏸ 暫停' : '▶ 播放'}</button>
            <button onClick={() => setResetKey((k) => k + 1)}>↺ 重設</button>
            <label className="inline">
              速度
              <input type="range" min="0.1" max="2" step="0.05" value={speed} onChange={(e) => setSpeed(+e.target.value)} />
              <span className="mono">{speed.toFixed(2)} 圈/秒</span>
            </label>
            <label className="inline">
              <input type="checkbox" checked={showTrace} onChange={(e) => setShowTrace(e.target.checked)} />
              顯示軌跡
            </label>
          </div>
          <div className="legend">
            <span><i className="sw ground" />固定桿 a</span>
            <span><i className="sw crank" />曲柄 b</span>
            <span><i className="sw coupler" />連桿 c</span>
            <span><i className="sw rocker" />搖桿 d</span>
            <span><i className="sw trace" />描點 P 軌跡（MuJoCo）</span>
            <span><i className="sw theory" />理論軌跡（解析解）</span>
          </div>
          <div className="chart-wrap">
            <div className="chart-title">
              最近 {HISTORY_SECONDS} 秒：<b className="c-rocker">搖桿角 θ4</b>、<b className="c-mu">傳動角 μ</b>
            </div>
            <canvas ref={chartCanvas} aria-label="角度歷程圖" />
          </div>
        </section>

        <aside className="panel">
          <div className="card">
            <h2>範例組合</h2>
            <div className="presets">
              {Object.entries(PRESETS).map(([name, p]) => (
                <button key={name} onClick={() => setParams(p)}>{name}</button>
              ))}
            </div>
          </div>

          <div className="card">
            <h2>桿長（公尺）</h2>
            {SLIDERS.map(({ key, label, min, max }) => (
              <label key={key} className="slider">
                <span>{label}</span>
                <input type="range" min={min} max={max} step="0.005" value={params[key]} onChange={(e) => setParam(key, +e.target.value)} />
                <span className="mono">{params[key].toFixed(3)}</span>
              </label>
            ))}
            <label className="inline">
              <input type="checkbox" checked={params.branch === -1} onChange={(e) => setParam('branch', e.target.checked ? -1 : 1)} />
              交叉型組裝（另一個解）
            </label>
          </div>

          <div className="card">
            <h2>機構分類</h2>
            <p className="type">{info.type}</p>
            <p className="mono small">
              Grashof：s + l = {(info.s + info.l).toFixed(3)} {info.grashof ? '≤' : '>'} p + q = {info.pq.toFixed(3)}
            </p>
            <p className="small">
              最短桿：{info.shortest}；曲柄
              {!range.possible ? '無法組裝' : range.full ? '可整圈轉動' : `只能在 ${deg(range.min).toFixed(1)}° ~ ${deg(range.max).toFixed(1)}° 擺動`}
            </p>
          </div>

          <div className="card">
            <h2>即時數據</h2>
            {readout && !readout.error ? (
              <dl className="readout">
                <dt>模擬時間</dt><dd>{readout.time.toFixed(2)} s</dd>
                <dt>曲柄角 θ2</dt><dd>{readout.th2.toFixed(1)}°</dd>
                <dt>連桿角 θ3</dt><dd>{readout.th3.toFixed(1)}°</dd>
                <dt>搖桿角 θ4</dt><dd>{readout.th4.toFixed(1)}°</dd>
                <dt>傳動角 μ</dt>
                <dd className={readout.mu < 40 ? 'warn' : ''}>{readout.mu.toFixed(1)}°{readout.mu < 40 ? '（偏小，傳力差）' : ''}</dd>
                <dt>迴路閉合誤差</dt><dd>{readout.gap.toFixed(3)} mm</dd>
                <dt>P 點與解析解差</dt><dd>{readout.err == null ? '—' : `${readout.err.toFixed(3)} mm`}</dd>
              </dl>
            ) : (
              <p className="small">{readout?.error ?? '等待模擬開始…'}</p>
            )}
          </div>

          <div className="card">
            <button className="link" onClick={() => setShowXml((v) => !v)}>
              {showXml ? '隱藏' : '顯示'} MuJoCo 模型（MJCF XML）
            </button>
            {showXml && <pre className="xml">{xml}</pre>}
          </div>
        </aside>
      </main>
    </div>
  );
}

function fitCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const { width, height } = canvas.getBoundingClientRect();
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function drawMechanism(canvas, P, trace, analytic, showTrace) {
  if (!canvas || !analytic.bounds) return;
  const { ctx, width, height } = fitCanvas(canvas);
  const col = (n) => cssVar(canvas, n);
  ctx.clearRect(0, 0, width, height);

  const b = analytic.bounds;
  const pad = 40;
  const scale = Math.min((width - 2 * pad) / (b.maxX - b.minX || 1), (height - 2 * pad) / (b.maxY - b.minY || 1));
  const cx = (b.minX + b.maxX) / 2;
  const cy = (b.minY + b.maxY) / 2;
  const T = ([x, y]) => [width / 2 + (x - cx) * scale, height / 2 - (y - cy) * scale];

  if (showTrace) {
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = col('--theory');
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    analytic.path.forEach((p, i) => (i ? ctx.lineTo(...T(p)) : ctx.moveTo(...T(p))));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = col('--trace');
    ctx.lineWidth = 2;
    ctx.beginPath();
    trace.forEach((p, i) => (i ? ctx.lineTo(...T(p)) : ctx.moveTo(...T(p))));
    ctx.stroke();
  }

  const link = (p, q, color, w = 8) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(...T(p));
    ctx.lineTo(...T(q));
    ctx.stroke();
  };

  // 固定桿與地面斜線
  link(P.O2, P.O4, col('--ground'), 4);
  for (const g of [P.O2, P.O4]) {
    const [x, y] = T(g);
    ctx.strokeStyle = col('--ground');
    ctx.lineWidth = 1.5;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * 6, y + 12);
      ctx.lineTo(x + i * 6 - 6, y + 20);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(x - 16, y + 12);
    ctx.lineTo(x + 16, y + 12);
    ctx.stroke();
  }

  // 連桿三角板（A-B-P）
  ctx.fillStyle = col('--coupler-fill');
  ctx.beginPath();
  ctx.moveTo(...T(P.A));
  ctx.lineTo(...T(P.B));
  ctx.lineTo(...T(P.P));
  ctx.closePath();
  ctx.fill();

  link(P.O2, P.A, col('--crank'));
  link(P.O4, P.Br, col('--rocker'));
  link(P.A, P.B, col('--coupler'));
  link(P.A, P.P, col('--coupler'), 3);

  const joint = (p, label, fill) => {
    const [x, y] = T(p);
    ctx.fillStyle = fill;
    ctx.strokeStyle = col('--fg');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = col('--fg');
    ctx.font = '600 13px system-ui, sans-serif';
    ctx.fillText(label, x + 9, y - 9);
  };
  joint(P.O2, 'O₂', col('--bg'));
  joint(P.O4, 'O₄', col('--bg'));
  joint(P.A, 'A', col('--bg'));
  joint(P.B, 'B', col('--bg'));
  joint(P.P, 'P', col('--trace'));
}

function drawChart(canvas, history) {
  if (!canvas) return;
  const { ctx, width, height } = fitCanvas(canvas);
  const col = (n) => cssVar(canvas, n);
  ctx.clearRect(0, 0, width, height);
  const padL = 40, padR = 10, padT = 8, padB = 18;
  const w = width - padL - padR;
  const h = height - padT - padB;

  // 縱軸固定 -180° ~ 180°
  ctx.strokeStyle = col('--grid');
  ctx.fillStyle = col('--muted');
  ctx.font = '11px system-ui, sans-serif';
  ctx.lineWidth = 1;
  for (const v of [-180, -90, 0, 90, 180]) {
    const y = padT + h * (1 - (v + 180) / 360);
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + w, y);
    ctx.stroke();
    ctx.fillText(`${v}°`, 4, y + 4);
  }
  if (history.length < 2) return;
  const t1 = history[history.length - 1].t;
  const t0 = t1 - HISTORY_SECONDS;
  const X = (t) => padL + ((t - t0) / HISTORY_SECONDS) * w;
  const Y = (v) => padT + h * (1 - (v + 180) / 360);

  const line = (key, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    let prev = null;
    for (const p of history) {
      const v = p[key];
      // 角度跨越 ±180° 時斷線，避免畫出垂直跳線
      if (prev != null && Math.abs(v - prev) > 180) ctx.moveTo(X(p.t), Y(v));
      else if (prev == null) ctx.moveTo(X(p.t), Y(v));
      else ctx.lineTo(X(p.t), Y(v));
      prev = v;
    }
    ctx.stroke();
  };
  line('th4', col('--rocker'));
  line('mu', col('--mu'));
}
