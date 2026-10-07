/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        apple: {
          blue: "#0066cc",
          "blue-focus": "#0071e3",
          "blue-dark": "#2997ff",
          ink: "#1d1d1f",
          parchment: "#f5f5f7",
          pearl: "#fafafc",
          "tile-1": "#272729",
          "tile-2": "#2a2a2c",
          "tile-3": "#252527",
          hairline: "#e0e0e0",
          "hairline-dark": "rgba(255, 255, 255, 0.12)",
          divider: "#f0f0f0",
          muted: "#7a7a7a",
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          "sans-serif"
        ],
        display: [
          '"SF Pro Display"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Helvetica Neue"',
          "sans-serif"
        ]
      },
      boxShadow: {
        'apple-product': 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0px',
        'apple-window': '0 25px 70px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'apple-window-light': '0 25px 70px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.08)',
        'apple-dock': '0 10px 40px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.15)',
        'apple-card': '0 4px 20px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'apple-card': '18px',
        'pill': '9999px',
      },
      letterSpacing: {
        'apple-tight': '-0.022em',
        'apple-display': '-0.028em',
      },
      animation: {
        shimmer: "shimmer 2s linear infinite"
      },
      keyframes: {
        shimmer: {
          from: {
            "backgroundPosition": "0 0"
          },
          to: {
            "backgroundPosition": "-200% 0"
          }
        }
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
