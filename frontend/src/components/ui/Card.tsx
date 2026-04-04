import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, style, ...props }: CardProps) {
  return (
    <div
      style={{
        background: "var(--white)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-sm)",
        border: "1px solid var(--border)",
        padding: "24px",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
