
function StatCard({ title, value, onClick, color }) {
  return (
    <div
      className="stat-card"
      onClick={onClick}
      style={{ borderLeft: `6px solid ${color}` }}
    >
      <h5 className="stat-title">{title}</h5>
      <h2 className="stat-value" style={{ color }}>
        {value}
      </h2>
    </div>
  );
}

export default StatCard;