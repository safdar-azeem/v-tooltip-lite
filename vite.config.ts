import path from 'path'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [
      vue(),
      dts({
         include: ['src/**/*.{ts,tsx,vue}', 'src/types/**/*.{ts,d.ts}'],
         copyDtsFiles: true,
      }),
   ],
   resolve: {
      alias: {
         '@': '/src',
      },
   },
   build: {
      lib: {
         entry: {
            index: path.resolve(__dirname, 'src/index.ts'),
         },
         formats: ['es'],
      },

      rollupOptions: {
         input: {
            index: path.resolve(__dirname, 'src/index.ts'),
         },
         external: ['vue'],
         output: {
            inlineDynamicImports: false,
            globals: {
               vue: 'Vue',
            },
         },
      },
   },
})
