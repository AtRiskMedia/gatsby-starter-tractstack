/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,tsx}',
    './src/components/**/*.{js,jsx,tsx}',
    './src/shopify-components/**/*.{js,jsx,tsx}',
    './src/custom/**/*.{js,jsx,tsx}',
    './src/templates/**/*.{js,jsx,tsx}',
    './tailwind.whitelist',
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 1s ease-in',
        fadeInUp: 'fadeInUp 1s ease-in',
        fadeInRight: 'fadeInRight 1s ease-in',
        fadeInLeft: 'fadeInLeft 1s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '.25' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translate3d(0, 10px, 0)', opacity: '.25' },
          '100%': { transform: 'translate3d(0, 0, 0)', opacity: '1' },
        },
        fadeInRight: {
          '0%': { transform: 'translate3d(10px,0, 0)', opacity: '.25' },
          '100%': { transform: 'translate3d(0, 0, 0)', opacity: '1' },
        },
        fadeInLeft: {
          '0%': { transform: 'translate3d(-10px,0, 0)', opacity: '.25' },
          '100%': { transform: 'translate3d(0, 0, 0)', opacity: '1' },
        },
      },
      lineHeight: {
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
        20: '5rem',
      },
      screens: {
        md: '801px',
        xl: '1367px',
      },
      spacing: {
        r1: 'calc(var(--scale) * .25rem)',
        r2: 'calc(var(--scale) * .5rem)',
        r3: 'calc(var(--scale) * .75rem)',
        r4: 'calc(var(--scale) * 1rem)',
        r5: 'calc(var(--scale) * 1.25rem)',
        r6: 'calc(var(--scale) * 1.5rem)',
        r7: 'calc(var(--scale) * 1.75rem)',
        r8: 'calc(var(--scale) * 2rem)',
        r9: 'calc(var(--scale) * 2.25rem)',
        r10: 'calc(var(--scale) * 2.5rem)',
        r11: 'calc(var(--scale) * 2.75rem)',
        r12: 'calc(var(--scale) * 3rem)',
        r14: 'calc(var(--scale) * 3.5rem)',
        r16: 'calc(var(--scale) * 4rem)',
        r20: 'calc(var(--scale) * 5rem)',
      },
      fontFamily: {
        action: ['Organetto-Regular'],
        main: ['FranklinGothicURW'],
      },
      fontSize: {
        rxs: 'calc(var(--scale) * 0.75rem)',
        rsm: 'calc(var(--scale) * 0.875rem)',
        rbase: 'calc(var(--scale) * 1rem)',
        rlg: 'calc(var(--scale) * 1.125rem)',
        rxl: 'calc(var(--scale) * 1.25rem)',
        r2xl: 'calc(var(--scale) * 1.5rem)',
        r3xl: 'calc(var(--scale) * 1.875rem)',
        r4xl: 'calc(var(--scale) * 2.5rem)',
        r5xl: 'calc(var(--scale) * 3rem)',
        r6xl: 'calc(var(--scale) * 3.75rem)',
        r7xl: 'calc(var(--scale) * 4.5rem)',
        r8xl: 'calc(var(--scale) * 6rem)',
        r9xl: 'calc(var(--scale) * 8rem)',
      },
      zIndex: {
        1: '101',
        2: '102',
        3: '103',
        4: '104',
        5: '105',
        6: '106',
        7: '107',
        8: '108',
        9: '109',
        10: '110',
        70010: '710',
        70020: '720',
        70030: '730',
        80000: '800', // for footer
        80010: '810', // context
        80020: '820',
        80030: '830',
        90000: '900', // for beliefs widget
        90001: '901', // for header or beliefs
        90002: '902', // for beliefs widget
        90003: '903', // for beliefs widget
        90004: '904', // for beliefs widget
        90005: '905', // for beliefs widget
        90006: '906', // for beliefs widget
        90007: '907', // for beliefs widget
        90008: '908', // for beliefs widget
        90009: '909', // for beliefs widget
        90101: '910', // for controller
      },
      colors: {
        mywhite: '#fcfcfc',
        myoffwhite: '#e3e3e3',
        myallwhite: '#ffffff',
        mylightgrey: '#a7b1b7',
        myblue: '#293f58',
        mygreen: '#c8df8c',
        myorange: '#f58333',
        mydarkgrey: '#393d34',
        myblack: '#10120d',
        myallblack: '#000000',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
