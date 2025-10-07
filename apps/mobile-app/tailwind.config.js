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
        BGlight: "#e8ebfd",
        BGdark: "#020617",
        TEXTlight: "#e9eefd",
        TEXTdark: "#020617",
        /* PRIMARY THEME */
        PRIMARY50: "#eef0f9",
        PRIMARY100: "#dee2f3",
        PRIMARY200: "#bfc8e9",
        PRIMARY300: "#9dacde",
        PRIMARY400: "#7b91d3",
        PRIMARY500: "#5a77c1",
        PRIMARY600: "#49619f",
        PRIMARY700: "#364a7b",
        PRIMARY800: "#253458",
        PRIMARY900: "#151f38",
        PRIMARY950: "#0e162a",
        /* SECONDARY THEME */
        SECONDARY50: "#c3fffc",
        SECONDARY100: "#61fff8",
        SECONDARY200: "#14ece5",
        SECONDARY300: "#11d4ce",
        SECONDARY400: "#0ebfb9",
        SECONDARY500: "#0ba8a3",
        SECONDARY600: "#078581",
        SECONDARY700: "#03625f",
        SECONDARY800: "#024341",
        SECONDARY900: "#012423",
        SECONDARY950: "#001716",
        /* ALERTS */
        ERRORlight: "#b00121",
        WARNlight: "#febb32",
        WARNdark: "#fe8801",
        INFOlight: "#33b5e5",
        INFOdark: "#0099cc",
        SUCCEEDEDlight: "#00c851",
        SUCCEEDEDdark: "#017e32",
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
