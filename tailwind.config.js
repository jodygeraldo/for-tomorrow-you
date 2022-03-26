module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          1: 'var(--blue1)',
          2: 'var(--blue2)',
          3: 'var(--blue3)',
          4: 'var(--blue4)',
          5: 'var(--blue5)',
          6: 'var(--blue6)',
          7: 'var(--blue7)',
          8: 'var(--blue8)',
          9: 'var(--blue9)',
          10: 'var(--blue10)',
          11: 'var(--blue11)',
          12: 'var(--blue12)',
        },
        gray: {
          1: 'var(--gray1)',
          2: 'var(--gray2)',
          3: 'var(--gray3)',
          4: 'var(--gray4)',
          5: 'var(--gray5)',
          6: 'var(--gray6)',
          7: 'var(--gray7)',
          8: 'var(--gray8)',
          9: 'var(--gray9)',
          10: 'var(--gray10)',
          11: 'var(--gray11)',
          12: 'var(--gray12)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
