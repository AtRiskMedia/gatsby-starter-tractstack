/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,tsx}",
    "./src/components/**/*.{js,jsx,tsx}",
    "./src/shopify-components/**/*.{js,jsx,tsx}",
    "./src/templates/**/*.{js,jsx,tsx}",
    "./tailwind.whitelist"
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 1s ease-in",
        fadeInUp: "fadeInUp 1s ease-in",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { transform: "translate3d(0, 10px, 0)", opacity: "0" },
          "100%": { transform: "translate3d(0, 0, 0)", opacity: "1" },
        },
      },
      lineHeight: {
        12: "3rem",
      },
      screens: {
        md: "801px",
        xl: "1367px",
      },
      fontFamily: {
        action: ["Organetto-Regular"],
      },
      fontSize: {
        rxs: "calc(var(--scale) * 0.75rem)",
        rsm: "calc(var(--scale) * 0.875rem)",
        rbase: "calc(var(--scale) * 1rem)",
        rlg: "calc(var(--scale) * 1.125rem)",
        rxl: "calc(var(--scale) * 1.25rem)",
        r2xl: "calc(var(--scale) * 1.5rem)",
        r3xl: "calc(var(--scale) * 1.875rem)",
        r4xl: "calc(var(--scale) * 2.25rem)",
        r5xl: "calc(var(--scale) * 3rem)",
        r6xl: "calc(var(--scale) * 3.75rem)",
        r7xl: "calc(var(--scale) * 4.5rem)",
        r8xl: "calc(var(--scale) * 6rem)",
        r9xl: "calc(var(--scale) * 8rem)",
      },
      zIndex: {
        70010: "70010", // impressions
        70020: "70020",
        70030: "70030",
        80000: "80000", // for footer
        80010: "80010", // context
        80020: "80020",
        80030: "80030",
        90000: "90000", // for beliefs widget
      },
      colors: {
        white: "#fcfcfc",
        offwhite: "#e3e3e3",
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
