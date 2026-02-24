"use client";

import { ReactNode } from "react";

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
}

const headingSizes = {
  1: "text-3xl font-bold",
  2: "text-2xl font-bold",
  3: "text-xl font-semibold",
  4: "text-lg font-semibold",
  5: "text-base font-semibold",
  6: "text-sm font-semibold",
};

export const Heading = ({ level, children, className = "" }: HeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const sizeClass = headingSizes[level];
  
  return (
    <Tag className={`${sizeClass} text-gray-900 ${className}`}>
      {children}
    </Tag>
  );
};
