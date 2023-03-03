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
      'sans': ['Coda', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
      'display': ['metalista-web'],
      'body': ['Coda'],
    },
    extend: {
      spacing: {
        "line": "1px"
      },
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "text-primary": "rgb(var(--color-text-primary))/ <alpha-value>",
        "text-secondary": "rgb(var(--color-text-secondary))/ <alpha-value>",
        background: "rgb(var(--color-background))/ <alpha-value>",
      }
    }
  },
  plugins: [textShadowPlugin],
}
