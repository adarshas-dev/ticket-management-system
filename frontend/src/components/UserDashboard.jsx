import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";

function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/tickets/my")
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
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  console.log("TICKETS DATA:", tickets);
  return (
    <>
      <div>
        <h2>My Tickets</h2>

        {tickets.length === 0 ? (
          <p>No tickets found</p>
        ) : (
          <Table responsive striped hover bordered>
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
    </>
  );
}
export default UserDashboard;
