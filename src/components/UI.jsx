import React from "react";

export function Button({ children, variant = "primary", onClick, disabled, type = "button", full }) {
  const styles = {
    primary: { background: "var(--saffron)", color: "var(--navy)" },
    dark: { background: "var(--navy)", color: "var(--white)" },
    outline: { background: "transparent", color: "var(--navy)", border: "1.5px solid var(--navy)" },
    danger: { background: "transparent", color: "var(--clay)", border: "1.5px solid var(--clay)" },
    success: { background: "var(--sage)", color: "var(--white)" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        border: styles[variant].border || "none",
        borderRadius: "10px",
        padding: "10px 18px",
        fontWeight: 600,
        fontSize: "0.95rem",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        width: full ? "100%" : "auto",
        transition: "transform 0.12s ease, box-shadow 0.12s ease",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}

export function Card({ children, style }) {
  return (
    <div
      style={{
        background: "var(--white)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        padding: "20px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Input({ label, style, ...props }) {
  return (
    <div style={{ marginBottom: "14px", textAlign: "left" }}>
      {label && (
        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px", color: "var(--navy)" }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1.5px solid var(--border)",
          fontSize: "0.95rem",
          fontFamily: "inherit",
          outline: "none",
          ...style,
        }}
      />
    </div>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: "14px", textAlign: "left" }}>
      {label && (
        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px", color: "var(--navy)" }}>
          {label}
        </label>
      )}
      <select
        {...props}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1.5px solid var(--border)",
          fontSize: "0.95rem",
          fontFamily: "inherit",
          background: "var(--white)",
        }}
      >
        {children}
      </select>
    </div>
  );
}

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { background: "#eee7d8", color: "var(--navy)" },
    success: { background: "#e3f0e9", color: "var(--sage)" },
    warn: { background: "#fbe9e7", color: "var(--clay)" },
  };
  return (
    <span
      style={{
        ...tones[tone],
        borderRadius: "20px",
        padding: "3px 12px",
        fontSize: "0.78rem",
        fontWeight: 600,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, subtitle }) {
  return (
    <div style={{ textAlign: "center", padding: "50px 20px", color: "#8a8a8a" }}>
      <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
        {title}
      </div>
      {subtitle && <div style={{ fontSize: "0.9rem" }}>{subtitle}</div>}
    </div>
  );
}
