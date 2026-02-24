"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = "", onClick }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${onClick ? "cursor-pointer hover:shadow-md" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
