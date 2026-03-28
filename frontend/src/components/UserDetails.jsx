import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import StatCard from "../components/StatCard";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");

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

  // const deleteUser = () => {
  //   if (!window.confirm("Are you sure you want to delete this user?")) return;

  //   api.delete(`/admin/users/${id}`).then(() => {
  //     navigate("/admin/users");
  //   });
  // };

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

      alert(user.active ? "User suspended" : "User activated");

      window.location.reload();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Something went wrong";

      alert(message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "25px" }}>
          <h2>{user.name}</h2>

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
        <div>
          <h4>User Reports</h4>

          <div
            style={{
              background: "#f8f9fa",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <p>No reports yet.</p>
          </div>

          <div style={{ marginTop: "20px" }}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add admin note..."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
              }}
            />
            <button
              className="btn btn-pink mt-2"
              style={{ color: "white" }}
              onClick={() => {
                // console.log("Admin comment:", comment);
                setComment("");
              }}
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UserDetails;
