/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable class-based dark mode
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        // add other custom colors as needed
      },
    },
  },
  plugins: [],
}
