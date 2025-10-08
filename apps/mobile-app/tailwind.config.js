const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        BGlight: "var(--color-BGlight)",
        BGdark: "var(--color-BGdark)",
        TEXTlight: "var(--color-TEXTlight)",
        TEXTdark: "var(--color-TEXTdark)",
        /* PRIMARY THEME */
        PRIMARY50: "var(--color-PRIMARY-50)",
        PRIMARY100: "var(--color-PRIMARY-100)",
        PRIMARY200: "var(--color-PRIMARY-200)",
        PRIMARY300: "var(--color-PRIMARY-300)",
        PRIMARY400: "var(--color-PRIMARY-400)",
        PRIMARY500: "var(--color-PRIMARY-500)",
        PRIMARY600: "var(--color-PRIMARY-600)",
        PRIMARY700: "var(--color-PRIMARY-700)",
        PRIMARY800: "var(--color-PRIMARY-800)",
        PRIMARY900: "var(--color-PRIMARY-900)",
        PRIMARY950: "var(--color-PRIMARY-950)",
        /* SECONDARY THEME */
        SECONDARY50: "var(--color-SECONDARY-50, hsl(177, 100%, 88.2%))",
        SECONDARY100: "var(--color-SECONDARY-100, hsl(177.3, 100%, 69%))",
        SECONDARY200: "var(--color-SECONDARY-200, hsl(178.1, 85%, 50.2%))",
        SECONDARY300: "var(--color-SECONDARY-300, hsl(178.2, 85.2%, 44.9%))",
        SECONDARY400: "var(--color-SECONDARY-400, hsl(178, 86.3%, 40.2%))",
        SECONDARY500: "var(--color-SECONDARY-500, hsl(178.1, 87.7%, 35.1%))",
        SECONDARY600: "var(--color-SECONDARY-600, hsl(178.1, 90%, 27.5%))",
        SECONDARY700: "var(--color-SECONDARY-700, hsl(178.1, 94.1%, 19.8%))",
        SECONDARY800: "var(--color-SECONDARY-800, hsl(178.2, 94.2%, 13.5%))",
        SECONDARY900: "var(--color-SECONDARY-900, hsl(178.3, 94.6%, 7.3%))",
        SECONDARY950: "var(--color-SECONDARY-950, hsl(177.4, 100%, 4.5%))",
        /* ALERTS */
        ERRORlight: "var(--color-ERRORlight, hsl(349 98.9% 34.7%))",
        WARNlight: "var(--color-WARNlight, hsl(40.3 99% 59.6%))",
        WARNdark: "var(--color-WARNdark, hsl(32 99.2% 50%))",
        INFOlight: "var(--color-INFOlight, hsl(196.2 77.4% 54.9%))",
        INFOdark: "var(--color-INFOdark, hsl(195 100% 40%))",
        SUCCEEDEDlight: "var(--color-SUCCEEDEDlight, hsl(144.3 100% 39.2%))",
        SUCCEEDEDdark: "var(--color-SUCCEEDEDdark, hsl(143.5 98.4% 24.9%))",
      },
      fontFamily: {
        poppins: ["Poppins-Regular"],
        "poppins-medium": ["Poppins-Medium"],
        "poppins-semibold": ["Poppins-SemiBold"],
        "poppins-bold": ["Poppins-Bold"],
        "poppins-italic": ["Poppins-Italic"],
        inter: ["Inter-Regular"],
        "inter-medium": ["Inter-Medium"],
        "inter-semibold": ["Inter-SemiBold"],
        "inter-bold": ["Inter-Bold"],
        "inter-italic": ["Inter-Italic"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth: {
        hairline: hairlineWidth(),
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("tailwindcss-animate")],
};
