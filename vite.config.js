import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const plugins = [tailwindcss()];

  if (mode === "production") {
    plugins.push(
      obfuscatorPlugin({
        options: {
          debugProtection: false,
        },
      })
    );
  }
  return {
    root: ".",
    base: "/",
    build: {
      minify: mode == "production" ? "terser" : "esbuild",
      terserOptions: {
        module: true,
        format: {
          comments: mode == "production" ? false : true,
        },
        compress: {
          drop_console: mode == "production" ? true : false,
          drop_debugger: false,
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      modulePreload: {
        polyfill: false,
      },
      target: "es2015",
      outDir: "../static",
      emptyOutDir: true,
      cssCodeSplit: true,
      sourcemap: mode == "production" ? false : true,
      cssMinify: mode == "production" ? true : false,
      manifest: false,
      rollupOptions: {
        input: {
          index: resolve(__dirname, "pages/index/index.html"),
          about: resolve(__dirname, "pages/index/about.html"),
          admin: resolve(__dirname, "pages/admin/admin_index.html"),
        },
      },
    },
    plugins: plugins,
    css: {
      preprocessorOptions: {
        scss: {},
      },
    },
  };
});
