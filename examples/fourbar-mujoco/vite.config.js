import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 部署到 GitHub Pages 時由 workflow 設定 BASE_PATH（例如 /vibe_coding_course_demo_01/fourbar-mujoco/）；本機開發維持 /
  base: process.env.BASE_PATH || '/',
  // MuJoCo 以 new URL('mujoco.wasm', import.meta.url) 載入 wasm，不要讓 Vite 預先打包它
  optimizeDeps: { exclude: ['@mujoco/mujoco'] },
  build: { target: 'es2022' },
});
