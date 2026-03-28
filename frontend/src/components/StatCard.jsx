function StatCard({ title, value, onClick, color }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#ffffff",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "0.25s ease",
        borderLeft: `6px solid ${color}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
      }}
    >
      <h5 style={{ marginBottom: "10px", color: "#6c757d" }}>{title}</h5>
      <h2 style={{ fontWeight: "700", color }}>{value}</h2>
    </div>
  );
}
export default StatCard;