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
    h1: "font-title font-bold text-4xl",
    h2: "font-title font-semibold text-3xl",
    h3: "font-title font-medium text-2xl",
    h4: "font-title font-medium text-xl",
    p: "font-body text-base leading-7",
    small: "font-body text-sm leading-none",
  };

  return React.createElement(
    variant,
    { className: cn(`${baseStyles[variant]} ${className}`) },
    children
  );
};

export default Typography;
