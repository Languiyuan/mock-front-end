export default {
  plugins: {
    'postcss-nested': {}, // 确保此行在 tailwindcss 之前
    tailwindcss: {},
    autoprefixer: {},
  },
}
