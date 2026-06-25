/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0D0D0D",
          secondary: "#111111",
        },
        accent: {
          cyan: "#00FFFF",
          blue: "#00B4FF",
          amber: "#FFB300",
          red: "#FF4444",
        },
        text: {
          primary: "#FFFFFF",
          muted: "#A0A0A0",
        },
      },
    },
  },
  plugins: [],
}
