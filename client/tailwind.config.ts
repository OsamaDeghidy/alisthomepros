import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f9ff',  // Sky Blue فاتح جداً
          100: '#ccf2ff', // Sky Blue فاتح
          200: '#99e6ff', // Sky Blue فاتح
          300: '#66d9ff', // Sky Blue متوسط الفتح
          400: '#33ccff', // Sky Blue متوسط
          500: '#00bfff', // Sky Blue الأساسي
          600: '#0099cc', // Sky Blue متوسط الغمق
          700: '#007399', // Sky Blue غامق
          800: '#004d66', // Sky Blue غامق جداً
          900: '#002633', // Sky Blue غامق جداً
        },
        dark: {
          50: '#f7f7f7',  // رمادي فاتح جداً
          100: '#e3e3e3', // رمادي فاتح
          200: '#c8c8c8', // رمادي فاتح
          300: '#a4a4a4', // رمادي متوسط
          400: '#818181', // رمادي متوسط
          500: '#666666', // رمادي متوسط
          600: '#515151', // رمادي غامق
          700: '#434343', // رمادي غامق
          800: '#383838', // رمادي غامق جداً
          900: '#1f1f1f', // الأسود الرئيسي
        },
        accent: {
          50: '#f8f9fa',  // فضي فاتح جداً
          100: '#f1f3f4', // فضي فاتح
          200: '#e8eaed', // فضي فاتح
          300: '#dadce0', // فضي متوسط
          400: '#bdc1c6', // فضي متوسط
          500: '#9aa0a6', // الفضي الأساسي
          600: '#80868b', // فضي غامق
          700: '#5f6368', // فضي غامق
          800: '#3c4043', // فضي غامق جداً
          900: '#202124', // فضي غامق جداً
        },
        success: {
          50: '#f0fdf4',  // أخضر فاتح جداً
          100: '#dcfce7', // أخضر فاتح
          200: '#bbf7d0', // أخضر فاتح
          300: '#86efac', // أخضر متوسط
          400: '#4ade80', // أخضر متوسط
          500: '#22c55e', // أخضر أساسي
          600: '#16a34a', // أخضر غامق
          700: '#15803d', // أخضر غامق
          800: '#166534', // أخضر غامق جداً
          900: '#14532d', // أخضر غامق جداً
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'elegant': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'elegant-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'upwork': '0 2px 4px 0 rgba(0, 0, 0, 0.06), 0 4px 8px 0 rgba(0, 0, 0, 0.06)',
        'upwork-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'float-delay': 'float 3s ease-in-out infinite 1.5s',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;