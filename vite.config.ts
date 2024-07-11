import react from '@vitejs/plugin-react-swc';
//import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@/root', replacement: path.resolve(__dirname) },
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ]
  }
});
