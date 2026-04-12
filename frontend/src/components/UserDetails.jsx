import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import StatCard from "../components/StatCard";
import { toast } from "react-toastify";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      api.get(`/admin/users/${id}`),
      api.get(`/admin/users/${id}/stats`),
    ])
      .then(([userRes, statsRes]) => {
        setUser(userRes.data);
        setStats(statsRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    api
      .get(`/reports/agent/${id}`)
      .then((res) => setReports(res.data))
      .catch(() => console.log("No reports found"));
  }, [id]);

  const toggleStatus = async () => {
    try {
      let autoAssign = false;

      if (user.active) {
        const confirmAction = window.confirm(
          "This user has active tickets.\n\nAuto-assign them to other agents?",
        );

        if (!confirmAction) {
          return;
        }

        autoAssign = true;
      }

      const res = await api.put(`/admin/users/${id}/toggle-status`, {
        autoAssign,
      });

      setUser(res.data);

      toast.success(user.active ? "User suspended" : "User activated");

      window.location.reload();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Something went wrong";

      toast.info(message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "25px" }}>
          <h2 className="text-format">{user.name}</h2>

          <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
            {/* <button className="btn btn-danger" onClick={deleteUser}>
              Delete User
            </button> */}

            <button
              className={`btn ${user.active ? "btn-warning" : "btn-success"}`}
              onClick={toggleStatus}
            >
              {user.active ? "Suspend" : "Activate"}
            </button>

            <span
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                backgroundColor: "#d1e7dd",
                color: "black",
                fontWeight: "bold",
              }}
            >
              {user.role}
            </span>

            <span
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                backgroundColor: "#d1e7dd",
                color: "black",
              }}
            >
              <b>Email : </b>
              {user.email}
            </span>

            <span
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                backgroundColor: "#d1e7dd",
                color: "black",
              }}
            >
              <b>User ID : </b>
              {user.id}
            </span>

            <span
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                backgroundColor: user.active ? "#198754" : "#dc3545",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {user.active ? "Active" : "Suspended"}
            </span>
          </div>
        </div>

        {/* USER STATS */}
        {stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            <StatCard title="Open" value={stats.open} color="#fd7e14" />
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              color="#ffc107"
            />
            <StatCard title="Resolved" value={stats.resolved} color="#198754" />
            <StatCard title="Closed" value={stats.closed} color="#6c757d" />
          </div>
        )}

        {/* REPORT / COMMENTS SECTION */}
        <div style={{ marginTop: "40px" }}>
          <h4 style={{ marginBottom: "15px" }} className="text-format">
            🚩 Reports Against This Agent
          </h4>

          {reports.length === 0 && (
            <p style={{ color: "gray" }}>No reports for this agent</p>
          )}

          {reports.map((r) => (
            <div
              key={r.id}
              className="report-card"
              onClick={() => navigate(`/tickets/${r.ticketId}`)}
            >
              <div style={{ fontWeight: "bold" }} className="text-format">{r.reportedByName}</div>

              <div style={{ fontSize: "13px", color: "gray" }}>
                Ticket #{r.ticketId} • {new Date(r.createdAt).toLocaleString()}
              </div>

              <div style={{ marginTop: "5px" }} className="text-format">{r.message}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UserDetails;
