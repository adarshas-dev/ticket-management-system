import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import DashboardLayout from "../layout/DashboardLayout";
import { toast } from "react-toastify";

function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("priority", priority);

      if (file) {
        formData.append("file", file);
      }

      await api.post("/tickets/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/");
      toast.success("Ticket created");
    } catch (err) {
      toast.error("Failed to create ticket");
    }
  };

  return (
    <DashboardLayout>
      <div className="create-ticket-container">
        {/* Header */}
        <div style={{ marginBottom: "25px" }}>
          <h2 className="text-format">Create New Ticket</h2>
          <p className="form-subtitle">
            Fill in the details below to raise a new support request.
          </p>
        </div>

        {/* Form Card */}
        <div className="form-card">
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

            <div className="mb-4">
              <label className="form-label fw-bold">Attachment</label>
              <input
                type="file"
                className="form-control"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (!file) return;

                  const allowed = [
                    "image/png",
                    "image/jpeg",
                    "application/pdf",
                  ];

                  if (!allowed.includes(file.type)) {
                    toast.error("Only PNG, JPEG, PDF allowed");
                    return;
                  }

                  if (file.size > 5 * 1024 * 1024) {
                    toast.error("File must be under 5MB");
                    return;
                  }

                  setFile(file);
                }}
              />
              <small>Allowed: PNG, JPEG, PDF (max 5MB)</small>
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
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>

              <Button type="submit" variant="primary">
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
