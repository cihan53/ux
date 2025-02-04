import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './src/components/**/*.{js,vue,ts}',
    './src/layouts/**/*.vue',
    './src/pages/**/*.vue',
    './src/plugins/**/*.{js,ts}',
    './src/stories/**/*.{js,ts,vue}',
    './src/app.vue',
    './src/error.vue'
  ],
  
  plugins: [],
  theme: {
    extend: {
      colors: {}
    }
  },
}
