import { useEffect, useState } from "react";
import { getApprovedTestimonials } from "../services/api";
import "./Testimonials.css";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const data = await getApprovedTestimonials();

        setTestimonials(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Unable to load testimonials:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((current) =>
        current === testimonials.length - 1
          ? 0
          : current + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials]);

  function goToPrevious() {
    setCurrentIndex((current) =>
      current === 0
        ? testimonials.length - 1
        : current - 1
    );
  }

  function goToNext() {
    setCurrentIndex((current) =>
      current === testimonials.length - 1
        ? 0
        : current + 1
    );
  }

  if (loading || testimonials.length === 0) {
    return null;
  }

  const testimonial =
    testimonials[currentIndex];

  return (
    <section className="testimonials-section">

      <div className="testimonials-heading">
        <p>WHAT OUR CUSTOMERS SAY</p>

        <h2>
          Experiences worth sharing.
        </h2>

        <span>
          Discover what customers are saying
          about their LUXECART experience.
        </span>
      </div>

      <div className="testimonial-slider">

        <button
          type="button"
          className="testimonial-arrow testimonial-prev"
          onClick={goToPrevious}
          aria-label="Previous testimonial"
        >
          ←
        </button>

        <div className="testimonial-slide-container">
          <article
            key={testimonial.id}
            className="testimonial-card testimonial-slide"
          >
            <div className="testimonial-stars">
              {"★".repeat(
                Number(testimonial.rating) || 0
              )}
              {"☆".repeat(
                5 -
                  (Number(testimonial.rating) || 0)
              )}
            </div>

            <p className="testimonial-comment">
              “{testimonial.comment}”
            </p>

            <div className="testimonial-customer">
              <div className="testimonial-avatar">
                {(
                  testimonial.customerName ||
                  "C"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <strong>
                  {testimonial.customerName}
                </strong>

                {testimonial.customerRole && (
                  <span>
                    {testimonial.customerRole}
                  </span>
                )}
              </div>
            </div>
          </article>
        </div>

        <button
          type="button"
          className="testimonial-arrow testimonial-next"
          onClick={goToNext}
          aria-label="Next testimonial"
        >
          →
        </button>

      </div>

      <div className="testimonial-dots">
        {testimonials.map(
          (item, index) => (
            <button
              key={item.id}
              type="button"
              className={
                index === currentIndex
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCurrentIndex(index)
              }
              aria-label={`View testimonial ${
                index + 1
              }`}
            />
          )
        )}
      </div>

    </section>
  );
}

export default Testimonials;