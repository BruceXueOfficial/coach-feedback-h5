import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  root: 'app',
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'mockup_builds/黄金十班次-教练反馈'),
    emptyOutDir: false,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'app/index.html'),
        'Feature-DutyOverview-V1': resolve(__dirname, 'app/Feature-DutyOverview-V1.html'),
        'Feature-DutyManagement-V1': resolve(__dirname, 'app/Feature-DutyManagement-V1.html'),
      },
    },
  },
})
