/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ffcs: {
          blue: {
            DEFAULT: '#123B70',
            dark: '#0B2244',
            light: '#1E58A4',
            vibrant: '#2563EB',
            accent: '#38BDF8',
          },
          red: {
            DEFAULT: '#DC2626',
            dark: '#991B1B',
            light: '#EF4444',
            hover: '#B91C1C',
          },
          white: {
            DEFAULT: '#FFFFFF',
            muted: '#F8FAFC',
            subtle: '#E2E8F0',
          },
          dark: {
            DEFAULT: '#0B1120',
            card: '#131D31',
            border: '#1E2D4A',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'motorsport-pattern': "radial-gradient(ellipse at top, #1e3a8a 0%, #0b1120 70%)",
        'tricolore-gradient': "linear-gradient(90deg, #123B70 0%, #FFFFFF 50%, #DC2626 100%)",
      }
    },
  },
  plugins: [],
}
