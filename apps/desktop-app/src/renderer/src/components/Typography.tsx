import React, { ReactNode } from "react";

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
    h1: "font-title font-bold text-[length:var(--text-h1)]",
    h2: "font-title font-semibold text-[length:var(--text-h2)]",
    h3: "font-title font-medium text-[length:var(--text-h3)]",
    h4: "font-title font-medium text-[length:var(--text-h4)]",
    p: "font-body text-[length:var(--text-p)]",
    small: "font-body text-[length:var(--text-small)]",
  };

  return React.createElement(
    variant,
    { className: `${baseStyles[variant]} ${className}` },
    children
  );
};

export default Typography;
