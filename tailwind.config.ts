
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        // Earth-toned cyberpunk theme colors (deuteranopia-friendly)
        cyber: {
          dark: "#c2c5aa", // seal_brown-100
          darker: "#0D0E0A", // ebony-100
          blue: "#A4AC86", // sage
          teal: "#656D4A", // reseda_green
          amber: "#936639", // raw_umber
          yellow: "#A68A64", // lion
          orange: "#7F4F24", // russet
          glow: "#B6AD90", // khaki
          muted: "#582F0E", // seal_brown
          mutedLight: "#9F5519", // seal_brown-600
          mutedDark: "#351C08" // seal_brown-300
        },
        // Add the full earth-tone palette
        seal_brown: {
          DEFAULT: '#582f0e',
          100: '#120903',
          200: '#231306',
          300: '#351c08',
          400: '#47260b',
          500: '#582f0e',
          600: '#9f5519',
          700: '#de7c2b',
          800: '#e9a772',
          900: '#f4d3b8'
        },
        russet: {
          DEFAULT: '#7f4f24',
          100: '#191007',
          200: '#331f0e',
          300: '#4c2f16',
          400: '#663f1d',
          500: '#7f4f24',
          600: '#b57033',
          700: '#d1935d',
          800: '#e0b793',
          900: '#f0dbc9'
        },
        raw_umber: {
          DEFAULT: '#936639',
          100: '#1d140b',
          200: '#3b2917',
          300: '#583d22',
          400: '#76522e',
          500: '#936639',
          600: '#ba854f',
          700: '#cca37b',
          800: '#ddc2a7',
          900: '#eee0d3'
        },
        lion: {
          DEFAULT: '#a68a64',
          100: '#221c13',
          200: '#433727',
          300: '#65533a',
          400: '#876f4d',
          500: '#a68a64',
          600: '#b8a183',
          700: '#c9b9a2',
          800: '#dbd0c1',
          900: '#ede8e0'
        },
        khaki: {
          DEFAULT: '#b6ad90',
          100: '#27241a',
          200: '#4f4934',
          300: '#766d4d',
          400: '#9d9068',
          500: '#b6ad90',
          600: '#c5bea6',
          700: '#d3cebc',
          800: '#e2ded3',
          900: '#f0efe9'
        },
        sage: {
          DEFAULT: '#a4ac86',
          100: '#222419',
          200: '#444932',
          300: '#666d4a',
          400: '#889263',
          500: '#a4ac86',
          600: '#b6bd9e',
          700: '#c8cdb6',
          800: '#dbdece',
          900: '#edeee7'
        },
        reseda_green: {
          DEFAULT: '#656d4a',
          100: '#14160f',
          200: '#282c1e',
          300: '#3d422d',
          400: '#51573b',
          500: '#656d4a',
          600: '#899465',
          700: '#a7b08a',
          800: '#c4cab1',
          900: '#e2e5d8'
        },
        ebony: {
          DEFAULT: '#414833',
          100: '#0d0e0a',
          200: '#1a1d14',
          300: '#272b1e',
          400: '#343929',
          500: '#414833',
          600: '#6a7553',
          700: '#919e77',
          800: '#b6bfa4',
          900: '#dadfd2'
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 5px theme('colors.seal_brown.600')",
            opacity: "0.8"
          },
          "50%": { 
            boxShadow: "0 0 15px theme('colors.seal_brown.600')",
            opacity: "1" 
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
