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
            {users
              .filter(
                (user) =>
                  user.name.toLowerCase().includes(search.toLowerCase()) ||
                  user.email.toLowerCase().includes(search.toLowerCase()) ||
                  user.role.toLowerCase().includes(search.toLowerCase()),
              )
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
                      className="btn btn-warning"
                      onClick={(e) => toggleStatus(e, user)}
                    >
                      Suspend
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </ThemeTable>
      </div>
    </DashboardLayout>
  );
}

export default ManageUsers;
