import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";
import { COLORS } from "@/constants/Colors";

export const THEME = {
  light: {
    background: COLORS.BG.light,
    foreground: COLORS.TEXT.dark,

    card: COLORS.PRIMARY[50],
    cardForeground: COLORS.TEXT.dark,

    popover: COLORS.BG.light,
    popoverForeground: COLORS.TEXT.dark,

    primary: COLORS.PRIMARY[800],
    primaryForeground: COLORS.TEXT.light,

    secondary: COLORS.SECONDARY[500],
    secondaryForeground: COLORS.TEXT.dark,

    muted: COLORS.PRIMARY[100],
    mutedForeground: COLORS.PRIMARY[800],

    accent: COLORS.SECONDARY[100],
    accentForeground: COLORS.SECONDARY[900],

    destructive: COLORS.ALERTS.ERRORlight,
    destructiveForeground: COLORS.TEXT.light,

    border: COLORS.PRIMARY[200],
    input: COLORS.PRIMARY[200],
    ring: COLORS.PRIMARY[400],
    radius: "0.625rem",

    chart1: COLORS.PRIMARY[400],
    chart2: COLORS.SECONDARY[300],
    chart3: COLORS.SECONDARY[700],
    chart4: COLORS.PRIMARY[200],
    chart5: COLORS.PRIMARY[900],
  },

  dark: {
    background: COLORS.BG.dark,
    foreground: COLORS.TEXT.light, // #e9eefd

    card: COLORS.BG.dark,
    cardForeground: COLORS.TEXT.light,

    popover: COLORS.BG.dark,
    popoverForeground: COLORS.TEXT.light,

    primary: COLORS.PRIMARY[100], // #dee2f3
    primaryForeground: COLORS.TEXT.dark, // #020617

    secondary: COLORS.SECONDARY[400], // #0ebfb9
    secondaryForeground: COLORS.TEXT.dark, // #020617

    muted: COLORS.PRIMARY[800], // #253458
    mutedForeground: COLORS.PRIMARY[200], // #bfc8e9

    accent: COLORS.SECONDARY[800], // #024341
    accentForeground: COLORS.SECONDARY[50], // #c3fffc

    destructive: COLORS.ALERTS.ERRORlight, // #b00121
    destructiveForeground: COLORS.TEXT.light, // #e9eefd

    border: COLORS.PRIMARY[800], // #253458
    input: COLORS.PRIMARY[800],
    ring: COLORS.PRIMARY[600], // #49619f
    radius: "0.625rem",

    chart1: COLORS.PRIMARY[400],
    chart2: COLORS.SECONDARY[200],
    chart3: COLORS.SECONDARY[700],
    chart4: COLORS.PRIMARY[300],
    chart5: COLORS.PRIMARY[950],
  },
};

export const NAV_THEME: Record<"light" | "dark", Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
