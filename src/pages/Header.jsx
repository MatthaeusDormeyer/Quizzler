import React from "react";

export default function Header() {
  return (
    <header style={S.header}>
      <div style={S.logo}>QUIZZLER</div>
    </header>
  );
}

const S = {
  header: {
    background: "#16977c",
    display: "flex",
    alignItems: "center",
    borderBottom: "2px solid #0f6d58",
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    boxSizing: "border-box",
    height: "120px",
    paddingLeft: "30px",
  },
  logo: {
    fontFamily: "'Courier Prime', monospace",
    fontWeight: "bold",
    fontSize: "40px",
    color: "black",
    letterSpacing: "2px",
    border: "3px solid black",
    padding: "6px 10px",
  },
};
