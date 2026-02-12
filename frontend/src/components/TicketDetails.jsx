import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");

  useEffect(() => {
    api
      .get(`/tickets/${id}`)
      .then((res) => setTicket(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const addComment = () => {
    api
      .post(`/comments/tickets/${id}`, { message: comment })
      .then(() => {
        setComment("");
        return api.get(`/tickets/${id}`);
      })
      .then((res) => setTicket(res.data));
  };

  if (loading) return <p>Loading...</p>;
  if (!ticket) return <p>Ticket not found</p>;
  return (
    <div>
      <h2>{ticket.title}</h2>
      <p>Status: {ticket.status}</p>
      <p>Description: {ticket.description}</p>
      <p>Created: {new Date(ticket.createdAt).toLocaleString()}</p>

      <h3>Comments</h3>
      {ticket.comments?.length === 0 && <p>No comments</p>}
      <ul>
        {ticket.comments?.map(c => (
          <li key={c.id}>
            <b>{c.user?.email}</b>: {c.message}
          </li>
        ))}
      </ul>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add comment"
      />
      <br />
      <button onClick={addComment}>Add Comment</button>
    </div>
  );
}
export default TicketDetails;
