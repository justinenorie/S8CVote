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
    light: "#e8ebfd",
    dark: "#020617",
  },
  TEXT: {
    light: "#e9eefd",
    dark: "#020617",
  },
  PRIMARY: {
    50: "#eef0f9",
    100: "#dee2f3",
    200: "#bfc8e9",
    300: "#9dacde",
    400: "#7b91d3",
    500: "#5a77c1",
    600: "#49619f",
    700: "#364a7b",
    800: "#253458",
    900: "#151f38",
    950: "#0e162a",
  },
  SECONDARY: {
    50: "#c3fffc",
    100: "#61fff8",
    200: "#14ece5",
    300: "#11d4ce",
    400: "#0ebfb9",
    500: "#0ba8a3",
    600: "#078581",
    700: "#03625f",
    800: "#024341",
    900: "#012423",
    950: "#001716",
  },
  ALERTS: {
    ERRORlight: "#b00121",
    WARNlight: "#febb32",
    WARNdark: "#fe8801",
    INFOlight: "#33b5e5",
    INFOdark: "#0099cc",
    SUCCESSlight: "#00c851",
    SUCCESSdark: "#017e32",
  },
};
