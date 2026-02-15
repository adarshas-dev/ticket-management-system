function getStatusStyle(status) {
  switch (status) {
    case "OPEN":
      return { backgroundColor: "#fd7e14", color: "white" };
    case "IN_PROGRESS":
      return { backgroundColor: "#ffc107", color: "black" };
    case "RESOLVED":
      return { backgroundColor: "#198754", color: "white" };
    case "CLOSED":
      return { backgroundColor: "#6c757d", color: "white" };
    default:
      return { backgroundColor: "#0d6efd", color: "white" };
  }
}

function formatStatus(status) {
  return status.replace("_", " ");
}

function StatusBadge({ status }) {
  return (
    <span
      style={{
        ...getStatusStyle(status),
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "0.85rem",
        fontWeight: "bold",
      }}
    >
      {formatStatus(status)}
    </span>
  );
}

export default StatusBadge;