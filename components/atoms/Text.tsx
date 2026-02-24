"use client";

import { ReactNode } from "react";

interface TextProps {
  children: ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
}

export const Text = ({ children, className = "", as: Component = "p" }: TextProps) => {
  return (
    <Component className={`text-gray-700 ${className}`}>
      {children}
    </Component>
  );
};
