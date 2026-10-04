// 四連桿（Four-bar linkage）解析運動學與 MuJoCo 模型產生器。
// 座標：機構在 MuJoCo 的 x-z 平面，z 朝上；鉸鏈軸為 -y，使正角度由 +x 轉向 +z（逆時針）。
//
//   O2 (0,0) ── 固定桿 a ── O4 (a,0)
//   曲柄 b：O2 → A
//   連桿 c：A → B（連桿上另有一個描點 P）
//   搖桿 d：O4 → B

export const DEFAULT_PARAMS = {
  a: 0.30, // 固定桿（地桿）
  b: 0.10, // 曲柄（輸入桿）
  c: 0.30, // 連桿（耦合桿）
  d: 0.25, // 搖桿（輸出桿）
  px: 0.15, // 描點 P 在連桿座標系的位置（沿 AB 方向）
  py: 0.10, // 描點 P 在連桿座標系的位置（垂直 AB 方向）
  branch: 1, // 1 = 開口型組裝（B 在上方），-1 = 交叉型組裝
};

/** Grashof 判別與機構分類 */
export function classify({ a, b, c, d }) {
  const links = [
    { name: '固定桿 a', v: a },
    { name: '曲柄 b', v: b },
    { name: '連桿 c', v: c },
    { name: '搖桿 d', v: d },
  ];
  const sorted = [...links].sort((x, y) => x.v - y.v);
  const s = sorted[0].v;
  const l = sorted[3].v;
  const pq = sorted[1].v + sorted[2].v;
  const grashof = s + l <= pq + 1e-12;
  const shortest = sorted[0].name;

  let type;
  if (!grashof) type = '三搖桿機構（非 Grashof，任何桿都無法整圈轉動）';
  else if (Math.abs(s + l - pq) < 1e-9) type = '變點機構（Grashof 臨界，s + l = p + q，會出現奇異位置）';
  else if (shortest === '曲柄 b') type = '曲柄搖桿機構（曲柄可整圈轉動，搖桿來回擺動）';
  else if (shortest === '固定桿 a') type = '雙曲柄機構（曲柄與搖桿都可整圈轉動）';
  else if (shortest === '連桿 c') type = '雙搖桿機構（Grashof，連桿可整圈轉動，曲柄只能擺動）';
  else type = '搖桿曲柄機構（搖桿可整圈轉動，曲柄只能擺動）';

  return { grashof, s, l, pq, shortest, type };
}

/** 曲柄 θ2 可轉動的範圍。full=true 表示可整圈轉動。 */
export function crankRange({ a, b, c, d }) {
  // |A - O4|^2 = a^2 + b^2 - 2ab cosθ2 必須介於 (c-d)^2 與 (c+d)^2 之間
  const lo = (a * a + b * b - (c + d) ** 2) / (2 * a * b); // cosθ2 下限
  const hi = (a * a + b * b - (c - d) ** 2) / (2 * a * b); // cosθ2 上限
  if (lo > 1 || hi < -1) return { possible: false };
  if (lo <= -1 && hi >= 1) return { possible: true, full: true };
  const min = Math.acos(Math.min(1, hi));
  const max = Math.acos(Math.max(-1, lo));
  return { possible: true, full: false, min, max };
}

/** 給定曲柄角 θ2，解出各點位置與角度；無解時回傳 null。 */
export function solve(params, theta2) {
  const { a, b, c, d, px, py, branch } = params;
  const A = [b * Math.cos(theta2), b * Math.sin(theta2)];
  const O4 = [a, 0];
  const dx = O4[0] - A[0];
  const dy = O4[1] - A[1];
  const e = Math.hypot(dx, dy);
  if (e > c + d + 1e-12 || e < Math.abs(c - d) - 1e-12 || e < 1e-12) return null;

  // 以 A 為圓心半徑 c、O4 為圓心半徑 d 的兩圓交點
  const along = (c * c - d * d + e * e) / (2 * e);
  const h = Math.sqrt(Math.max(0, c * c - along * along));
  const ux = dx / e;
  const uy = dy / e;
  const B = [A[0] + along * ux - branch * h * uy, A[1] + along * uy + branch * h * ux];

  const theta3 = Math.atan2(B[1] - A[1], B[0] - A[0]);
  const theta4 = Math.atan2(B[1] - O4[1], B[0] - O4[0]);
  const P = [
    A[0] + px * Math.cos(theta3) - py * Math.sin(theta3),
    A[1] + px * Math.sin(theta3) + py * Math.cos(theta3),
  ];
  return { A, B, P, O2: [0, 0], O4, theta2, theta3, theta4, transmission: transmissionAngle(theta3, theta4) };
}

/** 傳動角 μ：連桿與搖桿的夾角，以 0°~90° 表示（越接近 90° 傳力越好）。 */
export function transmissionAngle(theta3, theta4) {
  let mu = Math.abs(theta3 - theta4) % Math.PI;
  if (mu > Math.PI / 2) mu = Math.PI - mu;
  return mu;
}

/** 依參數產生 MuJoCo MJCF XML。 */
export function buildXml({ a, b, c, d, px, py }) {
  const f = (v) => v.toFixed(5);
  const r = 0.008; // 桿件半徑
  return `<mujoco model="fourbar">
  <compiler angle="radian"/>
  <option timestep="0.001" gravity="0 0 0" integrator="implicitfast"/>
  <default>
    <joint type="hinge" axis="0 -1 0" damping="0.02"/>
    <geom type="capsule" size="${r}" density="2700" contype="0" conaffinity="0"/>
  </default>
  <worldbody>
    <site name="O2" pos="0 0 0"/>
    <site name="O4" pos="${f(a)} 0 0"/>
    <body name="crank" pos="0 0 0">
      <joint name="j_crank"/>
      <geom fromto="0 0 0 ${f(b)} 0 0"/>
      <site name="A" pos="${f(b)} 0 0"/>
      <body name="coupler" pos="${f(b)} 0 0">
        <joint name="j_coupler"/>
        <geom fromto="0 0 0 ${f(c)} 0 0"/>
        <geom fromto="0 0 0 ${f(px)} 0 ${f(py)}" size="${r * 0.6}"/>
        <site name="B_coupler" pos="${f(c)} 0 0"/>
        <site name="P" pos="${f(px)} 0 ${f(py)}"/>
      </body>
    </body>
    <body name="rocker" pos="${f(a)} 0 0">
      <joint name="j_rocker"/>
      <geom fromto="0 0 0 ${f(d)} 0 0"/>
      <site name="B_rocker" pos="${f(d)} 0 0"/>
    </body>
  </worldbody>
  <equality>
    <!-- 封閉迴路：連桿末端與搖桿末端必須重合 -->
    <connect site1="B_coupler" site2="B_rocker" solref="0.002 1" solimp="0.99 0.999 0.001"/>
  </equality>
  <actuator>
    <!-- 以位置伺服驅動曲柄角度 -->
    <position name="drive" joint="j_crank" kp="200" kv="5"/>
  </actuator>
</mujoco>`;
}

/** 依解析解設定 MuJoCo 初始關節角，讓迴路在 t=0 就閉合。 */
export function initialQpos(params, theta2) {
  const sol = solve(params, theta2);
  if (!sol) return null;
  return {
    crank: sol.theta2,
    coupler: sol.theta3 - sol.theta2, // 相對於曲柄
    rocker: sol.theta4,
  };
}

/** 曲柄驅動角度：可整圈時等速旋轉，否則在可行範圍內來回擺動。 */
export function crankTarget(range, t, omega) {
  if (range.full) return omega * t;
  const margin = 0.03; // 避開死點
  const lo = range.min + margin;
  const hi = range.max - margin;
  const mid = (lo + hi) / 2;
  const amp = (hi - lo) / 2;
  return mid - amp * Math.cos(omega * t);
}

export function startAngle(range) {
  if (!range.possible) return null;
  return range.full ? 0 : range.min + 0.03;
}
