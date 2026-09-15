import { useState } from "react";
import { Link } from "react-router-dom";
import { createMessage } from "../services/api";
import { useStoreSettings } from "../context/StoreSettingsContext";
import TestimonialForm from "../components/TestimonialForm";
import "./Contact.css";

function Contact() {
  const { settings } = useStoreSettings();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSuccess("");
    setError("");

    const name = formData.customerName.trim();
    const email = formData.customerEmail.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setSending(true);

      const savedUser =
        localStorage.getItem("luxecartUser");

      let userId = null;

      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          userId = user?.id || null;
        } catch (err) {
          console.error(
            "Unable to read customer account:",
            err
          );
        }
      }

      await createMessage({
        userId,
        customerName: name,
        customerEmail: email,
        message,
      });

      setFormData({
        customerName: "",
        customerEmail: "",
        message: "",
      });

      setSuccess(
        "Your message has been sent successfully. Our team will reply soon."
      );
    } catch (err) {
      console.error(
        "Unable to send customer message:",
        err
      );

      setError(
        "Unable to send your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="contact-page">

      {/* CONTACT HERO */}

      <section className="contact-hero">

        <p className="contact-eyebrow">
          {settings.storeName} • CONTACT
        </p>

        <h1>
          How can we
          <br />
          help?
        </h1>

        <p>
          Have a question, suggestion, or need help
          with an order? Send us a message and our
          team will get back to you.
        </p>

      </section>

      {/* CONTACT SECTION */}

      <section className="contact-section">

        <div className="contact-info">

          <p className="contact-label">
            GET IN TOUCH
          </p>

          <h2>
            We're here for you.
          </h2>

          <p>
            Whether you have a question about a
            product, an order, delivery, or anything
            else, we'd love to hear from you.
          </p>

          <div className="contact-info-item">

            <span>
              EMAIL
            </span>

            <a href="mailto:bderrick674@gmail.com">
              bderrick674@gmail.com
            </a>

          </div>

          <div className="contact-info-item">

            <span>
              LOCATION
            </span>

            <strong>
              Accra, Ghana
            </strong>

          </div>

          <Link
            to="/my-orders"
            className="contact-orders-link"
          >
            View My Orders →
          </Link>

        </div>

        {/* CONTACT FORM */}

        <div className="contact-form-wrapper">

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="contact-field">

              <label htmlFor="customerName">
                NAME
              </label>

              <input
                id="customerName"
                name="customerName"
                type="text"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Your name"
              />

            </div>

            <div className="contact-field">

              <label htmlFor="customerEmail">
                EMAIL
              </label>

              <input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="you@example.com"
              />

            </div>

            <div className="contact-field">

              <label htmlFor="message">
                MESSAGE
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help?"
                rows="7"
              />

            </div>

            {error && (
              <div className="contact-form-message error">
                {error}
              </div>
            )}

            {success && (
              <div className="contact-form-message success">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="contact-submit-button"
              disabled={sending}
            >
              {sending
                ? "Sending..."
                : "Send Message →"}
            </button>

          </form>

        </div>

      </section>

      {/* TESTIMONIAL SECTION */}

      <section className="contact-testimonial-section">

        <div className="contact-testimonial-heading">

          <p className="contact-label">
            CUSTOMER VOICE
          </p>

          <h2>
            Share your LUXECART experience.
          </h2>

          <p>
            Tell us about your experience and help
            other customers discover LUXECART.
          </p>

        </div>

        <TestimonialForm />

      </section>

    </main>
  );
}

export default Contact;