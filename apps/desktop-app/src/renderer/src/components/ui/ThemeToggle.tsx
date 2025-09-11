import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./Button";

export function ThemeToggle(): React.ReactElement {
  const applyTheme = (dark: boolean): void => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="bg-BGdark dark:bg-BGlight relative flex w-full rounded-2xl p-1">
      {/* Animation background */}

      {/* Light Button */}
      <Button
        variant="default"
        className="text-TEXTdark bg-BGlight hover:bg-BGlight/90 dark:hover:bg-BGdark/20 relative z-10 flex-1 gap-2 rounded-xl"
        onClick={() => applyTheme(false)}
      >
        <Sun className="h-4 w-4" />
        Light
      </Button>

      {/* Dark Button */}
      <Button
        variant="default"
        className="text-TEXTlight bg-BGdark dark:bg-BGdark hover:bg-BGlight/10 dark:hover:bg-BGdark/90 relative z-10 flex-1 gap-2 rounded-xl"
        onClick={() => applyTheme(true)}
      >
        <Moon className="h-4 w-4" />
        Dark
      </Button>
    </div>
  );
}
