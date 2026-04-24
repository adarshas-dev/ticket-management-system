import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import DashboardLayout from "../layout/DashboardLayout";
import { toast } from "react-toastify";

function NewAdminAgent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("AGENT");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/create-user", {
        name,
        email,
        password,
        role,
      });
      toast.success("User created.");
      navigate("/");
    } catch (err) {
  const msg =
    err.response?.data?.message ||
    err.response?.data ||
    "Failed to create user";

  toast.error(msg);
}
  };

  return (
    <DashboardLayout>
      <div className="form-container">
        {/* Header */}
        <div style={{ marginBottom: "25px" }}>
          <h2 className="text-format">Create New User</h2>
        </div>

        {/* Form Card */}
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label className="form-label fw-bold">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            {/* <div className="mb-4">
              <label className="form-label fw-bold">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Create new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn border"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="fa-regular fa-eye-slash"></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </button>
              </div>
            </div> */}

            {/* User Type */}
            <div className="mb-4">
              <label className="form-label fw-bold">User Type</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="AGENT">AGENT</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>

              <Button type="submit" className="btn-pink">
                Create User
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default NewAdminAgent;
