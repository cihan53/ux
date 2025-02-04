// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  appDir: 'src',
  devtools: { enabled: true },
  compatibilityDate: "2025-02-03",
  css: ['./src/assets/main.css'],
  ui: {
    global: true 
    
  },
  tailwindcss: {
    
    exposeConfig: false,
     viewer: true,
     editorSupport: true
     // and more...
   },
  modules: [ '@nuxt/ui'],
})