import { useEffect, useState } from "react";
import api from "../api/axios";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

function AgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/tickets/assigned")
      .then((res) => {
        setTickets(res.data);
      })
      .catch((err) => {
        setError(
          err.response?.status === 403
            ? "Not authorized"
            : "Failed to load tickets",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading assigned tickets...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  return (
      <DashboardLayout>
        <div>
        <h2>Agent Dashboard</h2>

        {tickets.length === 0 ? (
          <p>No assigned tickets</p>
        ) : (
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} onClick={() => navigate(`/tickets/${t.id}`)} style={{cursor: "pointer"}}>
                  <td>{t.id}</td>
                  <td>{t.title}</td>
                  <td>{t.status}</td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
      </DashboardLayout>
  );
}
export default AgentDashboard;
