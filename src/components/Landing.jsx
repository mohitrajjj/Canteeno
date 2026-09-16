import React from "react";

export default function Landing({ onSelectRole }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--navy)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <img
        src="https://cdn.donmai.us/sample/bd/f6/__sanji_and_red_leg_zeff_one_piece_drawn_by_lilithartv__sample-bdf6ea06bf8f829e4dd8a82acf0eac83.jpg"
        alt="Canteeno chef"
        style={{ width: "220px", borderRadius: "12px", marginBottom: "20px" }}
      />
      <h1
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: "3.2rem",
          color: "var(--saffron)",
          marginBottom: "6px",
        }}
      >
        Canteeno
      </h1>
      <p style={{ color: "#c9d1e3", marginBottom: "36px", fontSize: "1rem" }}>
        Order food, manage wallets, run the canteen — all in one place.
      </p>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => onSelectRole("ADMIN")}
          style={{
            background: "var(--saffron)",
            color: "var(--navy)",
            border: "none",
            borderRadius: "10px",
            padding: "12px 24px",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          Continue as Admin
        </button>
        <button
          onClick={() => onSelectRole("EMPLOYEE")}
          style={{
            background: "transparent",
            color: "var(--cream)",
            border: "1.5px solid var(--cream)",
            borderRadius: "10px",
            padding: "12px 24px",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          Continue as Employee
        </button>
      </div>
    </div>
  );
}
