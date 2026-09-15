import { useState } from "react";
import { createTestimonial } from "../services/api";
import "./TestimonialForm.css";

function TestimonialForm() {
  const savedUser = localStorage.getItem("luxecartUser");

  let user = null;

  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      console.error("Unable to read saved user:", error);
    }
  }

  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    customerRole: "Customer",
    comment: "",
    rating: 5,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!user?.id) {
      setMessage("Please log in before submitting a testimonial.");
      return;
    }

    if (!formData.customerName.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!formData.comment.trim()) {
      setMessage("Please write a testimonial.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await createTestimonial({
        userId: user.id,
        customerName: formData.customerName.trim(),
        customerRole: formData.customerRole.trim(),
        comment: formData.comment.trim(),
        rating: Number(formData.rating),
      });

      setFormData({
        customerName: user.name || "",
        customerRole: "Customer",
        comment: "",
        rating: 5,
      });

      setMessage(
        "Thank you! Your testimonial has been submitted for review."
      );
    } catch (error) {
      console.error(
        "Unable to submit testimonial:",
        error
      );

      setMessage(
        error.message ||
          "Unable to submit testimonial."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!user?.id) {
    return (
      <div className="testimonial-login-message">
        <p>
          Please log in to share your experience with LUXECART.
        </p>
      </div>
    );
  }

  return (
    <div className="testimonial-form-wrapper">
      <div className="testimonial-form-heading">
        <p>SHARE YOUR EXPERIENCE</p>

        <h2>Tell us what you think</h2>

        <span>
          Your testimonial will be reviewed before appearing publicly.
        </span>
      </div>

      <form
        className="testimonial-form"
        onSubmit={handleSubmit}
      >
        <div className="testimonial-field">
          <label>Your Name</label>

          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </div>

        <div className="testimonial-field">
          <label>Role</label>

          <input
            type="text"
            name="customerRole"
            value={formData.customerRole}
            onChange={handleChange}
            placeholder="Customer"
          />
        </div>

        <div className="testimonial-field">
          <label>Rating</label>

          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          >
            <option value="5">★★★★★ 5 Stars</option>
            <option value="4">★★★★☆ 4 Stars</option>
            <option value="3">★★★☆☆ 3 Stars</option>
            <option value="2">★★☆☆☆ 2 Stars</option>
            <option value="1">★☆☆☆☆ 1 Star</option>
          </select>
        </div>

        <div className="testimonial-field">
          <label>Your Testimonial</label>

          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Tell us about your LUXECART experience..."
            rows="6"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit Testimonial"}
        </button>

        {message && (
          <p className="testimonial-form-message">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default TestimonialForm;