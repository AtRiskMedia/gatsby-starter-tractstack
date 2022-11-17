/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{js,jsx}", "./src/components/**/*.{js,jsx}"],
  theme: {
    extend: {
      zIndex: {
        70010: "70010",
        70020: "70020",
        70030: "70030",
      },
      colors: {
        white: "#fcfcfc",
        allwhite: "#ffffff",
        lightgrey: "#a7b1b7",
        blue: "#293f58",
        green: "#c8df8c",
        orange: "#f58333",
        darkgrey: "#393d34",
        black: "#10120d",
        allblack: "#000000",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
