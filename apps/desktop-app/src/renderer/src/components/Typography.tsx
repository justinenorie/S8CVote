import React, { ReactNode } from "react";

type Variant = "h1" | "h2" | "h3" | "p" | "small";

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
    h1: "font-bold font-title text-[--text-h1]",
    h2: "font-semibold font-title text-[--text-h2]",
    h3: "font-medium font-body text-[--text-h3]",
    p: "font-body text-[--text-p]",
    small: "font-body text-[--text-small]",
  };

  return React.createElement(
    variant,
    { className: `${baseStyles[variant]} ${className}` },
    children
  );
};

export default Typography;
