import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ThemeTable from "./ThemeTable";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const pageSize = 10;

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const fetchActiveUsers = () => {
    api.get("/admin/users/active").then((res) => setUsers(res.data));
  };

  const toggleStatus = async (e, user) => {
    e.stopPropagation(); // ✅ prevent row click

    try {
      let autoAssign = false;

      if (user.active && user.role === "AGENT") {
        const confirmAction = window.confirm(
          "This agent may have active tickets.\n\nAuto-assign them to other agents?",
        );
        if (!confirmAction) {
          return;
        }
        autoAssign = true;
      }
      await api.put(`/admin/users/${user.id}/toggle-status`, {
        autoAssign,
      });
      toast.success(`${user.name} suspended successfully`);

      //remove from active table immediately
      setUsers(users.filter((u) => u.id !== user.id));
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.info(message);
    }
  };

  //filter
  useEffect(() => {
    const q = (search || "").toLowerCase();
    const filtered = [...users]
      .sort((a, b) => b.id - a.id) // latest users first
      .filter((u) => {
        return (
          (u.name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q) ||
          (u.role || "").toLowerCase().includes(q)
        );
      });
    setFilteredUsers(filtered);
    setPage(0); // 🔥 reset page on search
  }, [users, search]);

  //pagination logic
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    page * pageSize,
    page * pageSize + pageSize,
  );

  return (
    <DashboardLayout>
      <div className="manage-users-page">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 className="text-format">Manage Users</h2>

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
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="4">No users found</td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => navigate(`/users/${user.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>

                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={(e) => toggleStatus(e, user)}
                    >
                      Suspend
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
      </div>
    </DashboardLayout>
  );
}

export default ManageUsers;
