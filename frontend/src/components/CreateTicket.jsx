import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import DashboardLayout from "../layout/DashboardLayout";

function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/tickets/create", {
        title,
        description,
        priority,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create ticket");
    }
  };

  return (
  <DashboardLayout>
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "25px" }}>
        <h2>Create New Ticket</h2>
        <p style={{ color: "#6c757d" }}>
          Fill in the details below to raise a new support request.
        </p>
      </div>

      {/* Form Card */}
      <div
        style={{
          background: "#f8f9fa",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
        }}
      >
        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div className="mb-4">
            <label className="form-label fw-bold">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter ticket title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="form-label fw-bold">Description</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Describe your issue in detail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Priority */}
          <div className="mb-4">
            <label className="form-label fw-bold">Priority</label>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
            >
              Create Ticket
            </Button>
          </div>

        </form>
      </div>
    </div>
  </DashboardLayout>
);
}

export default CreateTicket;
