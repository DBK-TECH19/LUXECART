import { useEffect, useState } from "react";
import {
  getTestimonials,
  approveTestimonial,
  rejectTestimonial,
  deleteTestimonial,
} from "../services/api";
import AdminSidebar from "./AdminSidebar";
import "./AdminTestimonials.css";

function AdminTestimonials() {
  const [testimonials, setTestimonials] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadTestimonials() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getTestimonials();

      setTestimonials(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load testimonials:",
        err
      );

      setError(
        "Unable to load testimonials."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function handleApprove(id) {
    try {
      await approveTestimonial(id);

      setTestimonials(
        current =>
          current.map(item =>
            item.id === id
              ? {
                  ...item,
                  isApproved: true,
                }
              : item
          )
      );
    } catch (err) {
      alert(
        err.message ||
          "Unable to approve testimonial."
      );
    }
  }

  async function handleReject(id) {
    try {
      await rejectTestimonial(id);

      setTestimonials(
        current =>
          current.map(item =>
            item.id === id
              ? {
                  ...item,
                  isApproved: false,
                }
              : item
          )
      );
    } catch (err) {
      alert(
        err.message ||
          "Unable to reject testimonial."
      );
    }
  }

  async function handleDelete(id) {
    const confirmed =
      window.confirm(
        "Delete this testimonial?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTestimonial(id);

      setTestimonials(
        current =>
          current.filter(
            item => item.id !== id
          )
      );
    } catch (err) {
      alert(
        err.message ||
          "Unable to delete testimonial."
      );
    }
  }

  const pendingCount =
    testimonials.filter(
      item => !item.isApproved
    ).length;

  const approvedCount =
    testimonials.filter(
      item => item.isApproved
    ).length;

  return (
    <div className="admin-testimonials-layout">
      <AdminSidebar />

      <main className="admin-testimonials-main">
        <header className="admin-testimonials-header">
          <div>
            <p className="admin-eyebrow">
              CUSTOMER FEEDBACK
            </p>

            <h1>
              Testimonials
            </h1>

            <p>
              Review customer testimonials
              before they appear on LUXECART.
            </p>
          </div>

          <button
            type="button"
            className="refresh-testimonials-button"
            onClick={loadTestimonials}
          >
            ↻ Refresh
          </button>
        </header>

        <section className="testimonials-summary">
          <div>
            <span>
              TOTAL
            </span>

            <strong>
              {testimonials.length}
            </strong>
          </div>

          <div>
            <span>
              PENDING
            </span>

            <strong>
              {pendingCount}
            </strong>
          </div>

          <div>
            <span>
              APPROVED
            </span>

            <strong>
              {approvedCount}
            </strong>
          </div>
        </section>

        <section className="admin-testimonials-list">

          {loading && (
            <div className="testimonial-empty">
              Loading testimonials...
            </div>
          )}

          {!loading &&
            error && (
              <div className="testimonial-empty error">
                {error}
              </div>
            )}

          {!loading &&
            !error &&
            testimonials.length === 0 && (
              <div className="testimonial-empty">
                <div>
                  ★
                </div>

                <h3>
                  No testimonials yet
                </h3>

                <p>
                  Customer testimonials
                  will appear here.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            testimonials.length > 0 && (
              <div className="testimonials-grid">

                {testimonials.map(
                  testimonial => (
                    <article
                      key={testimonial.id}
                      className={`admin-testimonial-card ${
                        testimonial.isApproved
                          ? "approved"
                          : "pending"
                      }`}
                    >

                      <div className="testimonial-card-top">

                        <div>
                          <span className="testimonial-number">
                            TESTIMONIAL #
                            {testimonial.id}
                          </span>

                          <h3>
                            {testimonial.customerName}
                          </h3>

                          {testimonial.customerRole && (
                            <p className="testimonial-role">
                              {testimonial.customerRole}
                            </p>
                          )}
                        </div>

                        <span
                          className={`testimonial-status ${
                            testimonial.isApproved
                              ? "approved"
                              : "pending"
                          }`}
                        >
                          {testimonial.isApproved
                            ? "Approved"
                            : "Pending"}
                        </span>

                      </div>

                      <div className="testimonial-stars">
                        {"★".repeat(
                          testimonial.rating
                        )}
                        {"☆".repeat(
                          5 -
                            testimonial.rating
                        )}
                      </div>

                      <p className="testimonial-comment">
                        "{testimonial.comment}"
                      </p>

                      <div className="testimonial-actions">

                        {!testimonial.isApproved && (
                          <button
                            type="button"
                            className="approve-testimonial"
                            onClick={() =>
                              handleApprove(
                                testimonial.id
                              )
                            }
                          >
                            Approve
                          </button>
                        )}

                        {testimonial.isApproved && (
                          <button
                            type="button"
                            className="reject-testimonial"
                            onClick={() =>
                              handleReject(
                                testimonial.id
                              )
                            }
                          >
                            Hide
                          </button>
                        )}

                        <button
                          type="button"
                          className="delete-testimonial"
                          onClick={() =>
                            handleDelete(
                              testimonial.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </article>
                  )
                )}

              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default AdminTestimonials;