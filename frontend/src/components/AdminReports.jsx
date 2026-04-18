import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ThemeTable from "./ThemeTable";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [filteredReports, setFilteredReports] = useState([]);
  const pageSize = 10;

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/reports")
      .then((res) => setReports(res.data))
      .catch(() => toast.error("Failed to load reports"))
      .finally(() => setLoading(false));

    api.put("/reports/mark-read");
  }, []);

  // const filteredReports = reports.filter((r) => {
  //   const q = search.toLowerCase();

  //   return (
  //     r.agentName?.toLowerCase().includes(q) ||
  //     r.reportedByName?.toLowerCase().includes(q) ||
  //     r.message?.toLowerCase().includes(q) ||
  //     r.ticketId?.toString().includes(q)
  //   );
  // });

  //filter
  useEffect(() => {
    const q = (search || "").toLowerCase();
    const filtered = [...reports]
      .sort((a, b) => b.id - a.id)
      .filter((u) => {
        return (
          (u.agentName || "").toLowerCase().includes(q) ||
          (u.reportedByName || "").toLowerCase().includes(q) ||
          (u.message || "")
            .toLowerCase()
            .includes(q)(u.ticketId || "")
            .toLowerCase()
            .includes(q)
        );
      });
    setFilteredReports(filtered);
    setPage(0);
  }, [reports, search]);

  //pagination logic
  const totalPages = Math.ceil(filteredReports.length / pageSize);
  const paginatedReports = filteredReports.slice(
    page * pageSize,
    page * pageSize + pageSize,
  );

  return (
    <DashboardLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 className="text-format">Reports</h2>

        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          style={{ maxWidth: "300px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ThemeTable>
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
          {loading ? (
            <tr>
              <td colSpan="7">Loading reports...</td>
            </tr>
          ) : paginatedReports.length === 0 ? (
            <tr>
              <td colSpan="7">No reports found</td>
            </tr>
          ) : (
            paginatedReports.map((r, index) => (
              <tr key={r.id}>
                <td>{index + 1}</td>

                <td
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  className="text-format"
                  onClick={() => navigate(`/users/${r.userId}`)}
                >
                  {r.reportedByName}
                </td>

                <td
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  className="text-format"
                  onClick={() => navigate(`/users/${r.agentId}`)}
                >
                  {r.agentName}
                </td>

                <td
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  className="text-format"
                  onClick={() =>
                    navigate(`/tickets/${r.ticketId}`, {
                      state: { id: r.ticketId }, // minimal state
                    })
                  }
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
                          setReports((prev) =>
                            prev.filter((rep) => rep.id !== r.id),
                          );
                        })
                        .catch(() => toast.error("Failed to resolve"));
                    }}
                  >
                    Resolve
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </ThemeTable>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination d-flex justify-content-center align-items-center mt-3">
          {/* Prev */}
          <button
            className="btn"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            style={{
              backgroundColor: page === 0 ? "#444" : "#0d6efd",
              color: "white",
              border: "none",
              padding: "4px 10px",
              fontSize: "13px",
              borderRadius: "6px",
              cursor: page === 0 ? "not-allowed" : "pointer",
            }}
          >
            ⬅Prev
          </button>

          {/* Page Info */}
          <span
            className="text-format"
            style={{
              fontSize: "13px",
              minWidth: "80px",
              textAlign: "center",
            }}
          >
            {page + 1} / {totalPages}
          </span>

          {/* Next */}
          <button
            className="btn"
            disabled={page === totalPages - 1}
            onClick={() => setPage(page + 1)}
            style={{
              backgroundColor: page === totalPages - 1 ? "#444" : "#0d6efd",
              color: "white",
              border: "none",
              padding: "4px 10px",
              fontSize: "13px",
              borderRadius: "6px",
              cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
            }}
          >
            Next➡
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminReports;
