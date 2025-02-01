// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: ['@/assets/main.css'],
  build: {
    transpile: ['/echarts/'],
  },
  srcDir: 'src/',
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  compatibilityDate: "2025-01-29",
  // devServer: {
  //   host: "0.0.0.0",
  //   port: 3000
  // },
  ui: {
    global: true,
  }
})