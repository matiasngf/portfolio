const { textShadowPlugin } = require('./utils/tw-plugins/text-shadow-plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    fontFamily: {
      'sans': ['var(--font-sans)', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['var(--font-mono)', 'SFMono-Regular'],
      'display': ['metalista-web'],
      'body': ['var(--font-sans)'],
    },
    extend: {
      spacing: {
        "line": "1px"
      },
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "t-primary": "rgb(var(--color-text-primary) / <alpha-value>)",
        "t-secondary": "rgb(var(--color-text-secondary) / <alpha-value>)",
        token: "rgb(var(--color-token) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        link: "rgb(var(--color-link) / <alpha-value>)",
      }
    }
  },
  plugins: [textShadowPlugin],
}
