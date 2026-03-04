import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  base: '/vue-bpmn-designer',
  plugins: [
    vue(),
    vueJsx(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/typings/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
      },
    }),
    Components({
      extensions: ['vue', 'tsx', 'md'],
      globs: ['src/components/*/*.vue', 'src/components/*/*.tsx', 'src/components/*/index.ts'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.[tj]sx?$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      dts: 'src/typings/components.d.ts',
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 打包分类
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        // 分包策略
        manualChunks: {
          vue: ['vue'],
          'element-plus-icons': ['@element-plus/icons-vue'],
          'element-plus': ['element-plus'],
          'bpmn-js': ['bpmn-js'],
          'bpmn-modules': [
            'bpmn-js-bpmnlint',
            'bpmn-js-color-picker',
            'bpmn-js-create-append-anything',
            'bpmn-js-token-simulation',
            'bpmnlint',
            'diagram-js',
            'diagram-js-grid',
            'diagram-js-grid-bg',
            'diagram-js-minimap',
          ],
          codemirror: ['codemirror'],
          'codemirror-lang': [
            '@codemirror/lang-json',
            '@codemirror/legacy-modes/mode/shell',
            '@codemirror/legacy-modes/mode/groovy',
            '@codemirror/lang-javascript',
          ],
        },
      },
    },
  },
})
