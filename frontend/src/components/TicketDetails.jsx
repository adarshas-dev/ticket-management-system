import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import DashboardLayout from "../layout/DashboardLayout";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function TicketDetails() {
  const { id } = useParams();
  const location = useLocation();

  const [ticket, setTicket] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);

  const [comment, setComment] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const { role } = useAuth();
  const [agents, setAgents] = useState([]);

  // fetch ticket
  useEffect(() => {
    api
      .get(`/tickets/${id}`)
      .then((res) => setTicket(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  // fetch agents (admin)
  useEffect(() => {
    if (role === "ADMIN") {
      api.get("/admin/agents").then((res) => setAgents(res.data));
    }
  }, [role]);

  const addComment = () => {
    api
      .post(`/comments/ticket/${id}`, { message: comment })
      .then(() => {
        setComment("");
        return api.get(`/tickets/${id}`);
      })
      .then((res) => setTicket(res.data));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "#fd7e14";
      case "IN_PROGRESS":
        return "#ffc107";
      case "RESOLVED":
        return "#198754";
      case "CLOSED":
        return "#6c757d";
      default:
        return "#0d6efd";
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case "OPEN":
        return "Open";
      case "IN_PROGRESS":
        return "In Progress";
      case "RESOLVED":
        return "Resolved";
      case "CLOSED":
        return "Closed";
      default:
        return status;
    }
  };

  const handleReport = async () => {
    if (!reportText.trim()) {
      toast.info("Please enter report details");
      return;
    }

    try {
      await api.post("/reports", {
        ticketId: ticket?.id,
        agentId: ticket?.assignedAgent?.id,
        message: reportText,
      });

      toast.success("Report submitted successfully");
      setReportText("");
      setShowReportModal(false);
    } catch {
      toast.error("Failed to submit report");
    }
  };

  return (
    <DashboardLayout>
      <div className="ticket-container">
        {/* HEADER */}
        <div style={{ marginBottom: "20px" }}>
          <h2 className="text-format">
            {ticket?.title || (
              <span className="spinner-border spinner-border-sm text-primary"></span>
            )}
          </h2>

          <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
            <span
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                backgroundColor: getStatusColor(ticket?.status),
                fontWeight: "bold",
                color: "white",
              }}
            >
              {ticket ? formatStatus(ticket.status) : "Loading"}
            </span>

            <span
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                backgroundColor: ticket?.assignedAgent ? "#d1e7dd" : "#f8d7da",
              }}
            >
              {ticket?.assignedAgent
                ? `Assigned to ${ticket.assignedAgent.name}`
                : "Not Assigned"}
            </span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "30px",
            marginBottom: "30px",
          }}
        >
          {/* LEFT */}
          <div className="ticket-card">
            <h4>Description</h4>
            <p>{ticket?.description || <span className="spinner-border spinner-border-sm text-primary"></span>}</p>

            {ticket?.attachment && (
              <div>
                <strong>Attachment:</strong>
                <br />
                <a
  href={`https://ticket-management-system-3jgy.onrender.com/uploads/${ticket.attachment}`}
  target="_blank"
  rel="noreferrer"
>
  View File
</a>
              </div>
            )}

            <hr />

            <p>
              <b>Created:</b>{" "}
              {ticket? (
                new Date(ticket.createdAt).toLocaleString()
              ) : (
                <span className="spinner-border spinner-border-sm text-primary"></span>
              )}
            </p>
          </div>

          {/* RIGHT */}
          <div className="ticket-card">
            {role === "AGENT" && ticket && (
              <>
                <h5>Update Status</h5>
                <select
                  value={ticket.status}
                  style={{ width: "100%", padding: "8px" }}
                  onChange={(e) => {
                    api
                      .put(
                        `/tickets/${ticket.id}/status?status=${e.target.value}`,
                      )
                      .then((res) => setTicket(res.data));
                  }}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </>
            )}

            {role === "ADMIN" && (
              <>
                <h5 style={{ marginTop: "20px" }}>Assign Agent</h5>
                <select
                  style={{ width: "100%", padding: "8px" }}
                  onChange={(e) => {
                    api
                      .put(`/tickets/${ticket?.id}/assign/${e.target.value}`)
                      .then((res) => setTicket(res.data));
                  }}
                >
                  <option value="">Select Agent</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        {/* COMMENTS */}
        <div>
          <h3 className="text-format">Comments</h3>

          {!loading && ticket?.comments?.length === 0 && (
            <p className="text-format">No comments yet</p>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {ticket?.comments?.map((c) => (
              <div key={c.id} className="comment-card">
                <b>{c.user?.name}</b>
                <p style={{ margin: "5px 0 0 0" }}>{c.message}</p>
              </div>
            ))}
          </div>

          {(role === "AGENT" || role === "USER") &&
            ticket?.status !== "CLOSED" && (
              <div style={{ marginTop: "20px" }}>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                />

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <button className="btn btn-primary mt-2" onClick={addComment}>
                    Add Comment
                  </button>

                  {role === "USER" && (
                    <button
                      className="btn btn-danger mt-2"
                      onClick={() => setShowReportModal(true)}
                    >
                      Report
                    </button>
                  )}
                </div>
              </div>
            )}
        </div>

        {/* MODAL */}
        <Modal
          show={showReportModal}
          onHide={() => setShowReportModal(false)}
          centered
        >
          <div style={{ padding: "20px" }}>
            <h4 className="text-format">Report Agent</h4>

            <textarea
              className="form-control mt-3"
              rows={4}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Explain what happened..."
            />

            <div className="mt-3 d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </button>

              <button className="btn btn-danger" onClick={handleReport}>
                Submit
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default TicketDetails;
