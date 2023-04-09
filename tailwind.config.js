/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,jsx,js}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      animation: {
        "ping-once": "ping 1s forwards 1",
        "slide-up": "slide 2s forwards 1"
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateY(0) translateX(-50%)", opacity: 100 },
          "25%": { transform: "translateY(0) translateX(-50%)", opacity: 100 },
          "50%": { transform: "translateY(-100%) translateX(-50%)", opacity: 100 },
          "75%": { transform: "translateY(-100%) translateX(-50%)", opacity: 0 },
          "100%": { transform: "translateY(0) translateX(-50%)", opacity: 0 }
        }
      },
    },
  },
  plugins: [require("daisyui")]
}
