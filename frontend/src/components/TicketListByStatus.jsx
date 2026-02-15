import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import { Table } from "react-bootstrap";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

function TicketListByStatus() {
  const { status } = useParams();
  const { role } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    let endpoint = "";

    if (role === "ADMIN") {
      endpoint = `/tickets/status/${status}`;
    } else if (role === "AGENT") {
      endpoint = `/tickets/assigned/status/${status}`;
    }else{
      return;
    }

    api.get(endpoint)
      .then(res => setTickets(res.data))
      .catch(err => {
        setError(
          err.response?.status === 403
            ? "Not authorized"
            : "Failed to load tickets"
        );
      })
      .finally(() => setLoading(false));

  }, [status, role]);

  return (
    <DashboardLayout>
      <div>
        <h2>{status} Tickets</h2>

        {loading && <p>Loading tickets...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && tickets.length === 0 && (
          <p>No tickets found</p>
        )}

        {!loading && !error && tickets.length > 0 && (
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t, index) => (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/tickets/${t.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>{t.title}</td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  <td>
                    <PriorityBadge priority={t.priority} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
}

export default TicketListByStatus;