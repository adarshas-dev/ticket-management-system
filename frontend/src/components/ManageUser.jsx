import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import { Table } from "react-bootstrap";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/admin/users")
      .then(res => setUsers(res.data));
  }, []);

  const deleteUser = (id) => {
    if (!window.confirm("Are you sure?")) return;

    api.delete(`/admin/users/${id}`)
      .then(() => {
        setUsers(users.filter(u => u.id !== id));
      });
  };

  return (
    <DashboardLayout>
      <h2>Manage Users</h2>

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
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="custom-btn" onClick={() => deleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DashboardLayout>
  );
}

export default ManageUsers;