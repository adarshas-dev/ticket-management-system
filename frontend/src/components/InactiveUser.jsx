import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ThemeTable from "./ThemeTable";

function InactiveUser() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchInactiveUsers();
  }, []);

  const fetchInactiveUsers = () => {
    api.get("/admin/users/inactive").then((res) => setUsers(res.data));
  };

  const activateUser = async (e, id) => {
    e.stopPropagation();

    try {
      await api.put(`/admin/users/${id}/toggle-status`);

      toast.success("User activated successfully");
      // alert("User activated successfully");

      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to activate user");
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
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 className="text-format">Inactive Users</h2>

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
            {paginatedUsers
              // .filter(
              //   (user) =>
              //     user.name.toLowerCase().includes(search.toLowerCase()) ||
              //     user.email.toLowerCase().includes(search.toLowerCase()) ||
              //     user.role.toLowerCase().includes(search.toLowerCase()),
              // )
              .map((user) => (
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
                      className="btn btn-success"
                      onClick={(e) => activateUser(e, user.id)}
                    >
                      Activate
                    </button>
                  </td>
                </tr>
              ))}
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

export default InactiveUser;
