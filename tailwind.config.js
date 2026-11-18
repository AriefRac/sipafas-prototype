/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface-2)',
        line: 'var(--border)',
        ink: 'var(--text)',
        muted: 'var(--muted)',
        nav: {
          DEFAULT: 'var(--nav)',
          text: 'var(--nav-text)',
          active: 'var(--nav-active)',
        },
        accent: {
          DEFAULT: 'rgb(109 91 246 / <alpha-value>)',
          hover: 'var(--accent-hover)',
          text: 'var(--accent-text)',
          soft: 'var(--accent-soft)',
        },
      },
      borderRadius: {
        card: '24px',
        ctl: '14px',
      },
      boxShadow: {
        soft: 'var(--shadow)',
        floating: 'var(--nav-shadow)',
      },
    },
  },
  plugins: [],
}
