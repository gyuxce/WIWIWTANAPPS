const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default;
const safeListFile = 'safelist.txt';
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.html', './src/**/*.js', './src/**/*.jsx', './src/**/*.ts', './src/**/*.tsx', './safelist.txt'],
  darkMode: 'class',
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      'caption-b': ['14px', { lineHeight: '21px', fontWeight: 700 }],
      'sub-b': ['12px', { lineHeight: '14px', fontWeight: 700 }],
      copy: ['14px', { lineHeight: '24px', fontWeight: 400 }],
      'copy-b': ['16px', { lineHeight: '24px', fontWeight: 700 }],
      h3: ['20px', { lineHeight: '25px', fontWeight: 400 }],
      'mobile-h3': ['16px', { lineHeight: '20px', fontWeight: 700 }],
      'mobile-sub-b': ['10px', { lineHeight: '12px', fontWeight: 700 }],
      'mobile-sub': ['10px', { lineHeight: '12px', fontWeight: 400 }],
    },
    fontFamily: {
      sans: [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
      manrope: ['Manrope', 'sans-serif'],
      goth: ['CenturyGothic-Regular'],
      gothBold: ['CenturyGothic-Bold'],
      sen: ['Sen'],
      senBold: ['Sen-Bold'],
      opificio: ['OpificioNeue'],
    },
    screens: {
      xls: '376',
      xs: '576',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      wide: '1390px',
      '1xl': '1536px',
      '2xl': '1600px',
      '3xl': '1800px',
      '4xl': '1900px',
      'max-xl': { max: '1280px' },
      'wide-XGA': '1367px',
      '960p': { max: '960px' },
    },
    extend: {
      colors: {
        main: {
          60: '#E7EBF6',
          100: '#DC2626',
          200: '#262564',
          300: '#DC2626',
          400: '#1F2937',
          500: '#F6F8FB',
          600: '#1F1C58',
        },
        second: {
          100: '#1F2937',
          200: '#262564',
          300: '#1E1E1E',
          400: '#F2F2F2',
          500: '#6B7280',
          600: '#E7E5E4',
        },
        green: {
          100: '#16A34A',
          200: '#CCFBF1',
          300: '#DCFCE7',
          500: '#22C55E',
        },
        red: {
          100: '#EF4444',
          200: '#FEE2E2',
          300: '#C63838',
          400: '#FF7F56',
        },
        grey: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          150: '#E5E7EB',
          200: '#f6f8fb',
          300: '#D6D3D1',
          400: '#D1D5DB',
          500: '#78716C',
        },
        slate: {
          100: '#F1F5F9',
        },
        blue: {
          100: '#DBEAFE',
          950: '#262564',
        },
        sky: {
          500: '#219FE7',
        },
        amber: {
          400: '#E2AF29',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.500'),
            maxWidth: '65ch',
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.400'),
          },
        },
      }),
    },
  },
  plugins: [
    ({ addUtilities, e, theme, variants }) => {
      const colors = flattenColorPalette(theme('borderColor'));
      delete colors['default'];

      const colorMap = Object.keys(colors).map((color) => ({
        [`.border-t-${color}`]: { borderTopColor: colors[color] },
        [`.border-r-${color}`]: { borderRightColor: colors[color] },
        [`.border-b-${color}`]: { borderBottomColor: colors[color] },
        [`.border-l-${color}`]: { borderLeftColor: colors[color] },
      }));
      const utilities = Object.assign({}, ...colorMap);

      addUtilities(utilities, variants('borderColor'));
    },
    // If your application does not require multiple theme selection,
    // you can replace {color} to your theme color value
    // this can drastically reduces the size of the output css file
    // e.g 'text-{colors}' --> 'text-emerald'
    require('tailwind-safelist-generator')({
      path: safeListFile,
      patterns: [
        'text-{colors}',
        'bg-{colors}',
        'dark:bg-{colors}',
        'dark:hover:bg-{colors}',
        'dark:active:bg-{colors}',
        'hover:text-{colors}',
        'hover:bg-{colors}',
        'active:bg-{colors}',
        'ring-{colors}',
        'hover:ring-{colors}',
        'focus:ring-{colors}',
        'focus-within:ring-{colors}',
        'border-{colors}',
        'focus:border-{colors}',
        'focus-within:border-{colors}',
        'dark:text-{colors}',
        'dark:hover:text-{colors}',
        'h-{height}',
        'w-{width}',
      ],
    }),
    require('@tailwindcss/typography'),
  ],
};
