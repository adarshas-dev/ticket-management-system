import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/reports")
      .then((res) => setReports(res.data))
      .catch(() => alert("Failed to load reports"));
    api.put("/reports/mark-read");
  }, []);

  return (
    <DashboardLayout>
      <h2>Reports</h2>

      <Table responsive striped hover>
        <thead>
          <tr>
            <th>No.</th>
            <th>Reported By</th>
            <th>Agent</th>
            <th>Ticket</th>
            <th>Message</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((r, index) => (
            <tr key={r.id}>
              <td>{index + 1}</td>
              <td
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => navigate(`/users/${r.userId}`)}
              >
                {r.reportedByName}
              </td>
              <td
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => navigate(`/users/${r.agentId}`)}
              >
                {r.agentName}
              </td>

              <td
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => navigate(`/tickets/${r.ticketId}`)}
              >
                #{r.ticketId}
              </td>

              <td>{r.message}</td>

              <td>{new Date(r.createdAt).toLocaleString()}</td>

              <td>
                <button
                  className="btn btn-sm btn-success"
                  onClick={(e) => {
                    e.stopPropagation();
                    api
                      .put(`/reports/${r.id}/resolve`)
                      .then(() => {
                        setReports(reports.filter((rep) => rep.id !== r.id));
                      })
                      .catch(() => alert("Failed to resolve"));
                  }}
                >
                  Resolve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DashboardLayout>
  );
}

export default AdminReports;
