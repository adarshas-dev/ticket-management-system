
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../auth/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { role, name, email } = useAuth();

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "25px" }}>
          <h2>My Profile</h2>
        </div>

        {/* Profile Card */}
        <div
          style={{
            background: "#f8f9fa",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
          }}
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