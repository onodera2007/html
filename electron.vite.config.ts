import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { ViteCspPlugin } from 'vite-plugin-csp'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ mode }) => {
    return {
        main: {
            plugins: [externalizeDepsPlugin()]
        },
        preload: {
            plugins: [externalizeDepsPlugin()]
        },
        renderer: {
            resolve: {
                alias: {
                    '@renderer': resolve('src/renderer/src')
                }
            },
            css: {
                preprocessorOptions: {
                    scss: {
                        api: 'modern-compiler' // 使用现代编译器API
                    }
                }
            },
            worker: {
                format: 'iife', // 重要：使用 IIFE 格式
                rollupOptions: {
                    output: {
                        format: 'iife',
                        // 确保所有依赖都内联
                        inlineDynamicImports: true
                    }
                }
            },
            build: {
                rollupOptions: {
                    output: {
                        inlineDynamicImports: false,
                        // 防止代码分割导致问题
                        manualChunks: undefined
                    }
                },
                assetsInlineLimit: 0
            },
            plugins: [
                vue(),
                mode === 'electron-web' ? viteSingleFile() : undefined,
                ViteCspPlugin({
                    policy: {
                        'default-src': ['self', 'unsafe-inline'],
                        'script-src': ['self', 'unsafe-inline'],
                        'worker-src': ['self', 'blob:', 'data:'],
                        'img-src': ['self', 'blob:', 'data:'],
                        'style-src': ['self', 'unsafe-inline'],
                        'connect-src': ['self', 'https://api.hakush.in', 'http://127.0.0.1:1371']
                    }
                }),
                AutoImport({
                    dirs: ['src/store'],
                    imports: ['vue', 'pinia'],
                    dts: 'src/dts/auto-imports.d.ts',
                    vueTemplate: true,
                    resolvers: [ElementPlusResolver()]
                }),
                Components({
                    dts: 'src/dts/components.d.ts',
                    dirs: ['src/components'],
                    resolvers: [ElementPlusResolver()]
                })
            ]
        }
    }
})
