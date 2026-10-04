import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // MuJoCo 以 new URL('mujoco.wasm', import.meta.url) 載入 wasm，不要讓 Vite 預先打包它
  optimizeDeps: { exclude: ['@mujoco/mujoco'] },
  build: { target: 'es2022' },
});
