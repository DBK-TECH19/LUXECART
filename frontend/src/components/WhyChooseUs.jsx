import "./WhyChooseUs.css";


const benefits = [
  {
    icon: "✦",
    title: "Quality Products",
    text: "We carefully select products that combine quality, style and value.",
  },
  {
    icon: "↗",
    title: "Fast Delivery",
    text: "Get your orders delivered quickly and conveniently to your doorstep.",
  },
  {
    icon: "◇",
    title: "Secure Payments",
    text: "Shop with confidence using secure and reliable payment options.",
  },
  {
    icon: "♡",
    title: "Customer Support",
    text: "Our team is here to help whenever you need assistance with your order.",
  },
];

function WhyChooseUs() {
  return (
    <section className="why-section">
      <div className="why-heading">
        <p>WHY CHOOSE US</p>

        <h2>Shopping made simple.</h2>

        <span>
          Everything you need for a smooth, enjoyable shopping experience.
        </span>
      </div>

      <div className="benefits-grid">
        {benefits.map((benefit) => (
          <article className="benefit-card" key={benefit.title}>
            <div className="benefit-icon">{benefit.icon}</div>

            <h3>{benefit.title}</h3>

            <p>{benefit.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;