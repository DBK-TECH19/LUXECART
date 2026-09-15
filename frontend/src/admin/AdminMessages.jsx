import { useEffect, useState } from "react";
import {
  getMessages,
  replyToMessage,
  deleteMessage,
} from "../services/api";
import AdminSidebar from "./AdminSidebar";
import "./AdminMessages.css";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyText, setReplyText] = useState({});
  const [replyingId, setReplyingId] = useState(null);

  async function loadMessages() {
    try {
      setLoading(true);
      setError("");

      const data = await getMessages();

      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError("Unable to load customer messages.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();

    const interval = setInterval(() => {
      loadMessages();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  async function handleReply(id) {
    const reply = String(replyText[id] || "").trim();

    if (!reply) {
      alert("Please enter a reply.");
      return;
    }

    try {
      setReplyingId(id);

      const updatedMessage = await replyToMessage(id, reply);

      setMessages((current) =>
        current.map((message) =>
          message.id === id ? updatedMessage : message
        )
      );

      setReplyText((current) => ({
        ...current,
        [id]: "",
      }));
    } catch (err) {
      console.error("Failed to send reply:", err);
      alert("Unable to send reply.");
    } finally {
      setReplyingId(null);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMessage(id);

      setMessages((current) =>
        current.filter((message) => message.id !== id)
      );
    } catch (err) {
      console.error("Failed to delete message:", err);
      alert("Unable to delete message.");
    }
  }

  function formatDate(date) {
    if (!date) return "N/A";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "N/A";
    }

    return parsed.toLocaleString("en-GH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const newMessages = messages.filter(
    (message) =>
      String(message.status || "New").toLowerCase() === "new"
  ).length;

  const repliedMessages = messages.filter(
    (message) =>
      String(message.status || "").toLowerCase() === "replied"
  ).length;

  return (
    <div className="admin-messages-layout">
      <AdminSidebar />

      <main className="admin-messages-main">
        <div className="admin-messages-header">
          <div>
            <p className="admin-eyebrow">
              CUSTOMER COMMUNICATION
            </p>

            <h1>Messages</h1>

            <p>
              Read and reply to messages from your customers.
            </p>
          </div>

          <button
            type="button"
            className="refresh-messages-button"
            onClick={loadMessages}
            disabled={loading}
          >
            ↻ {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <section className="messages-summary">
          <div className="message-summary-card">
            <span>TOTAL MESSAGES</span>
            <strong>{messages.length}</strong>
          </div>

          <div className="message-summary-card">
            <span>NEW</span>
            <strong>{newMessages}</strong>
          </div>

          <div className="message-summary-card">
            <span>REPLIED</span>
            <strong>{repliedMessages}</strong>
          </div>
        </section>

        <section className="messages-section">
          <div className="messages-section-header">
            <div>
              <p className="admin-eyebrow">
                INBOX
              </p>

              <h2>Customer Messages</h2>
            </div>

            {newMessages > 0 && (
              <span className="messages-new-badge">
                {newMessages} New
              </span>
            )}
          </div>

          {loading && (
            <div className="admin-messages-message">
              Loading messages...
            </div>
          )}

          {!loading && error && (
            <div className="admin-messages-message error">
              {error}
            </div>
          )}

          {!loading && !error && messages.length === 0 && (
            <div className="admin-messages-message">
              <div className="messages-empty-icon">
                ✉
              </div>

              <h3>No customer messages</h3>

              <p>
                Customer questions and comments will
                appear here.
              </p>
            </div>
          )}

          {!loading && !error && messages.length > 0 && (
            <div className="messages-list">
              {messages.map((message) => {
                const status = message.status || "New";

                return (
                  <article
                    key={message.id}
                    className={`admin-message-card ${
                      String(status).toLowerCase() === "new"
                        ? "is-new"
                        : ""
                    }`}
                  >
                    <div className="admin-message-top">
                      <div className="message-customer">
                        <div className="message-avatar">
                          {(
                            message.customerName || "C"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <span className="message-label">
                            MESSAGE #{message.id}
                          </span>

                          <h3>
                            {message.customerName ||
                              "Customer"}
                          </h3>

                          <span className="message-email">
                            {message.customerEmail ||
                              "No email"}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`message-status ${String(
                          status
                        ).toLowerCase()}`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="customer-message-content">
                      <span>CUSTOMER MESSAGE</span>

                      <p>{message.message}</p>
                    </div>

                    {message.reply && (
                      <div className="existing-reply">
                        <span>ADMIN REPLY</span>

                        <p>{message.reply}</p>

                        {message.repliedAt && (
                          <small>
                            Replied{" "}
                            {formatDate(message.repliedAt)}
                          </small>
                        )}
                      </div>
                    )}

                    <div className="message-reply-area">
                      <textarea
                        value={replyText[message.id] || ""}
                        onChange={(event) =>
                          setReplyText((current) => ({
                            ...current,
                            [message.id]:
                              event.target.value,
                          }))
                        }
                        placeholder={
                          message.reply
                            ? "Write a new reply..."
                            : "Write your reply..."
                        }
                        rows="4"
                      />

                      <div className="message-actions">
                        <button
                          type="button"
                          className="send-reply-button"
                          disabled={
                            replyingId === message.id
                          }
                          onClick={() =>
                            handleReply(message.id)
                          }
                        >
                          {replyingId === message.id
                            ? "Sending..."
                            : message.reply
                            ? "Update Reply"
                            : "Send Reply"}
                        </button>

                        <button
                          type="button"
                          className="delete-message-button"
                          onClick={() =>
                            handleDelete(message.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="message-date">
                      Received{" "}
                      {formatDate(message.createdAt)}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminMessages;