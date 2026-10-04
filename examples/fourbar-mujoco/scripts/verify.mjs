// 以 Node 驗證：MuJoCo 模擬結果是否與四連桿解析解一致。
// 執行：npm run verify
import loadMujoco from '@mujoco/mujoco';
import { DEFAULT_PARAMS, buildXml, classify, crankRange, crankTarget, initialQpos, solve, startAngle } from '../src/fourbar.js';

const mj = await loadMujoco();

const cases = [
  { name: '預設：曲柄搖桿', p: DEFAULT_PARAMS },
  { name: '雙曲柄', p: { ...DEFAULT_PARAMS, a: 0.08, b: 0.20, c: 0.25, d: 0.22 } },
  { name: '雙搖桿（Grashof）', p: { ...DEFAULT_PARAMS, a: 0.30, b: 0.22, c: 0.12, d: 0.25 } },
  { name: '三搖桿（非 Grashof）', p: { ...DEFAULT_PARAMS, a: 0.30, b: 0.20, c: 0.20, d: 0.28 } },
];

let failed = false;
for (const { name, p } of cases) {
  const range = crankRange(p);
  const m = mj.MjModel.from_xml_string(buildXml(p));
  const d = new mj.MjData(m);
  const SITE = mj.mjtObj.mjOBJ_SITE.value;
  const id = (n) => mj.mj_name2id(m, SITE, n);
  const ids = { B: id('B_coupler'), P: id('P') };

  const q0 = initialQpos(p, startAngle(range));
  d.qpos[0] = q0.crank;
  d.qpos[1] = q0.coupler;
  d.qpos[2] = q0.rocker;
  mj.mj_forward(m, d);

  const omega = 2 * Math.PI * 0.5; // 0.5 圈/秒
  let maxErr = 0;
  for (let i = 0; i < 4000; i++) {
    d.ctrl[0] = crankTarget(range, d.time, omega);
    mj.mj_step(m, d);
    if (i % 50 === 0) {
      // site_xpos 對應積分前的狀態，因此以 A 點位置反推曲柄角
      const ia = 3 * mj.mj_name2id(m, SITE, 'A');
      const sol = solve(p, Math.atan2(d.site_xpos[ia + 2], d.site_xpos[ia]));
      if (!sol) continue;
      const bx = d.site_xpos[3 * ids.P];
      const bz = d.site_xpos[3 * ids.P + 2];
      maxErr = Math.max(maxErr, Math.hypot(bx - sol.P[0], bz - sol.P[1]));
    }
  }
  const ok = maxErr < 0.1e-3; // 0.1 mm
  failed ||= !ok;
  console.log(`${ok ? 'OK ' : 'NG '} ${name}｜${classify(p).type}｜整圈=${range.full}｜描點 P 最大誤差 ${(maxErr * 1000).toFixed(3)} mm｜曲柄角 ${d.qpos[0].toFixed(2)} rad`);
  d.delete();
  m.delete();
}
process.exit(failed ? 1 : 0);
