import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function InactiveUser() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInactiveUsers();
  }, []);

  const fetchInactiveUsers = () => {
    api.get("/admin/users/inactive")
      .then((res) => setUsers(res.data));
  };

  const activateUser = async (e, id) => {
    e.stopPropagation(); // ✅ prevent row click navigation

    try {
      await api.put(`/admin/users/${id}/toggle-status`);

      alert("User activated successfully");

      // ✅ remove from inactive table immediately
      setUsers(users.filter((u) => u.id !== id));

    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to activate user"
      );
    }
  };

  return (
    <DashboardLayout>
      <h2>Inactive Users</h2>

      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
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
      </Table>
    </DashboardLayout>
  );
}

export default InactiveUser;