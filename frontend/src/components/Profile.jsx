import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import { toast } from "react-toastify";

function Profile() {
  const navigate = useNavigate();
  const { role, name, email, logout } = useAuth();

  const [showModal, setShowModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isValidPassword = (password) =>
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password);

  const handleChangePassword = async () => {
    if (!isValidPassword(newPassword)) {
      toast.error(
        "Password must be 6+ chars, include uppercase, lowercase and number",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success("Password changed. Please login again");

      setShowModal(false);

      localStorage.removeItem("token");
      logout();

      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data || "Failed to change password");
    }
  };

  return (
    <DashboardLayout>
      <div className="profile-container">
        <div style={{ marginBottom: "25px" }}>
          <h2 className="text-format">My Profile</h2>
        </div>

        <div className="profile-card">
          <div className="mb-4">
            <label className="form-label fw-bold">Name</label>
            <input type="text" className="form-control" value={name} disabled />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Role</label>
            <input type="text" className="form-control" value={role} disabled />
          </div>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back
            </Button>

            <Button className="btn-pink" onClick={() => setShowModal(true)}>
              Change Password
            </Button>
          </div>
        </div>

        {/* MODAL */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>

            <Button className="btn-pink" onClick={handleChangePassword}>
              Update Password
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default Profile;
