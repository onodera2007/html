// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import cspPlugin from "vite-plugin-csp";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src")
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler"
          // 使用现代编译器API
        }
      }
    },
    plugins: [
      vue(),
      cspPlugin({
        enabled: true,
        policy: {
          "script-src": ["self", "unsafe-inline"],
          "default-src": ["self"],
          "style-src": ["self", "unsafe-inline"],
          "connect-src": ["self", "https://api.hakush.in", "http://127.0.0.1:1371"]
        },
        hashEnabled: {
          "script-src": true,
          "style-src": true,
          "script-src-attr": false,
          "style-src-attr": false
        }
      }),
      AutoImport({
        dirs: ["src/store"],
        imports: ["vue", "pinia"],
        dts: "src/dts/auto-imports.d.ts",
        vueTemplate: true,
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        dts: "src/dts/components.d.ts",
        dirs: ["src/components"],
        resolvers: [ElementPlusResolver()]
      })
    ]
  }
});
export {
  electron_vite_config_default as default
};
