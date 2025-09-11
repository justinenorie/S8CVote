import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./Button";

interface ThemeToggleProps {
  isCollapsed?: boolean;
}

export function ThemeToggle({
  isCollapsed,
}: ThemeToggleProps): React.ReactElement {
  const [isDark, setIsDark] = React.useState<boolean>(
    document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark"
  );

  const applyTheme = (dark: boolean): void => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    }
  };

  if (isCollapsed) {
    return (
      <div className="bg-BGdark dark:bg-BGlight relative flex w-full rounded-2xl p-1 transition-colors duration-300">
        <Button
          variant="default"
          className={`relative z-10 flex-1 gap-2 rounded-xl transition-colors duration-300 ${
            isDark
              ? "text-TEXTlight bg-BGdark hover:bg-BGlight/10 dark:hover:bg-BGdark/90"
              : "text-TEXTdark bg-BGlight hover:bg-BGlight/90 dark:hover:bg-BGdark/20"
          }`}
          onClick={() => applyTheme(!isDark)}
        >
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-BGdark dark:bg-BGlight relative flex w-full rounded-2xl p-1 transition-colors duration-300">
      {/* Light Button */}
      <Button
        variant="default"
        className="text-TEXTdark bg-BGlight hover:bg-BGlight/90 dark:hover:bg-BGdark/20 relative z-10 flex-1 gap-2 rounded-xl transition-colors duration-300"
        onClick={() => applyTheme(false)}
      >
        <Sun className="h-4 w-4" />
        {!isCollapsed && "Light"}
      </Button>

      {/* Dark Button */}
      <Button
        variant="default"
        className="text-TEXTlight bg-BGdark dark:bg-BGdark hover:bg-BGlight/10 dark:hover:bg-BGdark/90 relative z-10 flex-1 gap-2 rounded-xl transition-colors duration-300"
        onClick={() => applyTheme(true)}
      >
        <Moon className="h-4 w-4" />
        {!isCollapsed && "Dark"}
      </Button>
    </div>
  );
}
