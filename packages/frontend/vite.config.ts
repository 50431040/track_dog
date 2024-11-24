import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { vitePluginForArco } from '@arco-plugins/vite-react'
import {resolve} from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vitePluginForArco()],
  resolve: {
    alias: {
      // 根路径
      "~": resolve(__dirname, "./"),
      // src 路径
      "@": resolve(__dirname, "src"),
    },
  },
})
