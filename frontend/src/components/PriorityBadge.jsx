function getPriorityStyle(priority) {
  switch (priority) {
    case "LOW":
      return { backgroundColor: "#20c997", color: "white" };
    case "MEDIUM":
      return { backgroundColor: "#0d6efd", color: "white" };
    case "HIGH":
      return { backgroundColor: "#fd7e14", color: "white" };
    case "URGENT":
      return { backgroundColor: "#dc3545", color: "white" };
    default:
      return { backgroundColor: "#adb5bd", color: "white" };
  }
}

function PriorityBadge({ priority }) {
  return (
    <span
      style={{
        ...getPriorityStyle(priority),
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "0.85rem",
        fontWeight: "bold",
      }}
    >
      {priority}
    </span>
  );
}

export default PriorityBadge;