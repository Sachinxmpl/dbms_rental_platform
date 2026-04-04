import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
}

export function Badge({
  children,
  color = "var(--text-secondary)",
  bg = "#F1F5F9",
}: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 12px",
        borderRadius: "var(--radius-pill)",
        fontSize: "12px",
        fontWeight: 600,
        color,
        background: bg,
      }}
    >
      {children}
    </span>
  );
}
