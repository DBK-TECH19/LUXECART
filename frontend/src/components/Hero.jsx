import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <p className="hero-eyebrow">CURATED FOR YOUR LIFESTYLE</p>

        <h1>
          Discover Something <span>Special.</span>
        </h1>

        <p className="hero-description">
          Explore a carefully selected collection of premium products
          designed to bring style, comfort and quality into everyday life.
        </p>

        <a href="/products" className="hero-button">
          Shop Collection <span>→</span>
        </a>
      </div>
    </section>
  );
}

export default Hero;