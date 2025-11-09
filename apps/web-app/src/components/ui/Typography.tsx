import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "h1" | "h2" | "h3" | "h4" | "p" | "small";

interface TypographyProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const Typography: React.FC<TypographyProps> = ({
  variant = "p",
  children,
  className = "",
}) => {
  const baseStyles: Record<Variant, string> = {
    h1: "font-title font-bold text-3xl md:text-4xl",
    h2: "font-title font-semibold text-2xl md:text-3xl",
    h3: "font-title font-medium text-1xl md:text-2xl",
    h4: "font-title font-medium text-xl md:text-1xl",
    p: "font-body text-sm md:text-lg leading-7",
    small: "font-body text-xs sm:text-sm leading-none",
  };

  return React.createElement(
    variant,
    { className: cn(`${baseStyles[variant]} ${className}`) },
    children
  );
};

export default Typography;
