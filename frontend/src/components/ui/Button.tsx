import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const styles: Record<Variant, React.CSSProperties> = {
  primary: { background: "var(--orange)", color: "#fff" },
  secondary: { background: "var(--green)", color: "#fff" },
  ghost: {
    background: "var(--white)",
    color: "var(--text-primary)",
    border: "1.5px solid var(--border)",
  },
  danger: { background: "#FEE2E2", color: "#DC2626" },
};

const sizes: Record<Size, React.CSSProperties> = {
  sm: { padding: "8px 18px", fontSize: "13px" },
  md: { padding: "12px 28px", fontSize: "14px" },
  lg: { padding: "15px 36px", fontSize: "16px" },
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  fullWidth,
  children,
  style,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      style={{
        borderRadius: "var(--radius-pill)",
        fontWeight: 600,
        fontFamily: "var(--font-body)",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.7 : 1,
        transition: "all 0.18s ease",
        width: fullWidth ? "100%" : "auto",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        border: "none",
        ...styles[variant],
        ...sizes[size],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled || loading) return;
        const el = e.currentTarget;
        if (variant === "primary") el.style.background = "var(--orange-hover)";
        if (variant === "secondary") el.style.background = "var(--green-hover)";
        if (variant === "ghost") el.style.background = "#F8F6F1";
        el.style.transform = "translateY(-1px)";
        el.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        if (variant === "primary") el.style.background = "var(--orange)";
        if (variant === "secondary") el.style.background = "var(--green)";
        if (variant === "ghost") el.style.background = "var(--white)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
      {...props}
    >
      {loading ? <Spin /> : children}
    </button>
  );
}

function Spin() {
  return (
    <span
      style={{
        width: 16,
        height: 16,
        border: "2px solid rgba(255,255,255,0.4)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}
