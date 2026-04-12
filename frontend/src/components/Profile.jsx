
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../auth/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { role, name, email } = useAuth();

  return (
    <DashboardLayout>
      <div className="profile-container">

        {/* Header */}
        <div style={{ marginBottom: "25px" }}>
          <h2 className="text-format">My Profile</h2>
        </div>

        {/* Profile Card */}
        <div
          className="profile-card"
        >
          <form >

            {/* Name */}
            <div className="mb-4">
              <label className="form-label fw-bold">Name</label>
              <input
                type="name"
                className="form-control"
                value={name}
                disabled
              />
            </div>

            {/* Email (readonly) */}
            <div className="mb-4">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                disabled
              />
            </div>

            {/* Role (readonly) */}
            <div className="mb-4">
              <label className="form-label fw-bold">Role</label>
              <input
                type="text"
                className="form-control"
                value={role}
                disabled
              />
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-between">
              <Button
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            </div>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;