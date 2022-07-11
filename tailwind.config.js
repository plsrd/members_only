/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.pug'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    styled: true,
    themes: ['dracula'],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: '',
    darkTheme: 'dark',
  },
};
