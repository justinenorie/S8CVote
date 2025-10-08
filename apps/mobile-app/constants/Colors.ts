/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const COLORS = {
  BG: {
    light: "hsl(231.4 84% 95.1%)",
    dark: "hsl(228.6 84% 4.9%)",
  },
  TEXT: {
    light: "hsl(225 83.3% 95.3%)",
    dark: "hsl(228.6 84% 4.9%)",
  },
  PRIMARY: {
    50: "hsl(229.1 47.8% 95.5%)",
    100: "hsl(228.6 46.7% 91.2%)",
    200: "hsl(227.1 48.8% 83.1%)",
    300: "hsl(226.2 49.6% 74.3%)",
    400: "hsl(225 50% 65.5%)",
    500: "hsl(223.1 45.4% 55.5%)",
    600: "hsl(223.3 37.1% 45.5%)",
    700: "hsl(222.6 39% 34.7%)",
    800: "hsl(222.4 40.8% 24.5%)",
    900: "hsl(222.9 45.5% 15.1%)",
    950: "hsl(222.9 50% 11%)",
  },
  SECONDARY: {
    50: "hsl(177 100% 88.2%)",
    100: "hsl(177.3 100% 69%)",
    200: "hsl(178.1 85% 50.2%)",
    300: "hsl(178.2 85.2% 44.9%)",
    400: "hsl(178 86.3% 40.2%)",
    500: "hsl(178.1 87.7% 35.1%)",
    600: "hsl(178.1 90% 27.5%)",
    700: "hsl(178.1 94.1% 19.8%)",
    800: "hsl(178.2 94.2% 13.5%)",
    900: "hsl(178.3 94.6% 7.3%)",
    950: "hsl(177.4 100% 4.5%)",
  },
  ALERTS: {
    ERRORlight: "hsl(349 98.9% 34.7%)",
    WARNlight: "hsl(40.3 99% 59.6%)",
    WARNdark: "hsl(32 99.2% 50%)",
    INFOlight: "hsl(196.2 77.4% 54.9%)",
    INFOdark: "hsl(195 100% 40%)",
    SUCCESSlight: "hsl(144.3 100% 39.2%)",
    SUCCESSdark: "hsl(143.5 98.4% 24.9%)",
  },
};
