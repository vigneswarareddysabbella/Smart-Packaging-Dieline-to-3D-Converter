export default function Header() {
  return (
    <header
      style={{
        height: 60,
        background: "#111827",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderBottom: "1px solid #334155",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 800 }}>Dieline to 3D Generator</div>
      <div style={{ fontSize: 13, color: "#cbd5e1" }}>Panel-based preview</div>
    </header>
  );
}
