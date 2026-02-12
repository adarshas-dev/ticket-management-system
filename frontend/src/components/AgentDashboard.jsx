import { useEffect, useState } from "react";
import api from "../api/axios";

function AgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <>
      <div>
        <h2>Agent Dashboard</h2>

        {tickets.length === 0 ? (
          <p>No assigned tickets</p>
        ) : (
          <table>
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
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.title}</td>
                  <td>{t.status}</td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
export default AgentDashboard;
