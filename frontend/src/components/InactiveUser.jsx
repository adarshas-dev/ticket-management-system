import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ThemeTable from "./ThemeTable";

function InactiveUser() {
  const [users, setUsers] = useState([]);
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

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-format">Inactive Users</h2>

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
        </ThemeTable>
      </div>
    </DashboardLayout>
  );
}

export default InactiveUser;
