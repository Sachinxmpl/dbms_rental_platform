import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, style, ...props }: InputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          background: "var(--white)",
          border: `1.5px solid ${error ? "#DC2626" : "var(--border)"}`,
          borderRadius: "var(--radius-pill)",
          padding: "12px 20px",
          fontSize: "14px",
          color: "var(--text-primary)",
          outline: "none",
          transition: "border-color 0.15s",
          width: "100%",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error
            ? "#DC2626"
            : "var(--orange)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? "#DC2626"
            : "var(--border)";
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: "12px", color: "#DC2626" }}>{error}</span>
      )}
      {hint && !error && (
        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
          {hint}
        </span>
      )}
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, style, ...props }: TextAreaProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          {label}
        </label>
      )}
      <textarea
        style={{
          background: "var(--white)",
          border: `1.5px solid ${error ? "#DC2626" : "var(--border)"}`,
          borderRadius: "16px",
          padding: "14px 20px",
          fontSize: "14px",
          color: "var(--text-primary)",
          outline: "none",
          resize: "vertical",
          minHeight: "100px",
          transition: "border-color 0.15s",
          width: "100%",
          fontFamily: "var(--font-body)",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--orange)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: "12px", color: "#DC2626" }}>{error}</span>
      )}
    </div>
  );
}
