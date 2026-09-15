import "./About.css";

function About() {
  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>

        <div className="about-hero-content">
          <p className="about-label">WELCOME TO LUXECART</p>

          <h1>
            More Than Shopping.
            <span> A Better Way to Discover.</span>
          </h1>

          <p>
            LUXECART brings together style, quality and convenience
            to create a shopping experience made for modern living.
          </p>
        </div>
      </section>


      {/* OUR STORY */}
      <section className="about-story">

        <div className="about-story-image">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80"
            alt="LUXECART shopping experience"
          />
        </div>

        <div className="about-story-content">
          <p className="about-label">OUR STORY</p>

          <h2>
            Built Around
            <span> What Matters.</span>
          </h2>

          <p>
            LUXECART was created with a simple idea: shopping should be
            convenient, inspiring and enjoyable.
          </p>

          <p>
            We bring carefully selected products into one modern
            marketplace, helping customers discover things they love
            without making the experience complicated.
          </p>

          <p>
            From everyday essentials to products that add something
            special to your lifestyle, LUXECART is designed to make
            every purchase feel worthwhile.
          </p>
        </div>

      </section>


      {/* WHY LUXECART */}
      <section className="why-luxecart">

        <div className="why-header">
          <p className="about-label">WHY LUXECART</p>

          <h2>
            Shopping With
            <span> Purpose.</span>
          </h2>

          <p>
            Everything we do is focused on making your shopping
            experience better.
          </p>
        </div>

        <div className="values-grid">

          <div className="value-card">
            <div className="value-number">01</div>
            <h3>Quality</h3>
            <p>
              We focus on products that offer quality,
              usefulness and lasting value.
            </p>
          </div>

          <div className="value-card">
            <div className="value-number">02</div>
            <h3>Convenience</h3>
            <p>
              Discover and shop for what you need
              through a simple and seamless experience.
            </p>
          </div>

          <div className="value-card">
            <div className="value-number">03</div>
            <h3>Style</h3>
            <p>
              We believe everyday products can still
              be thoughtful, modern and beautifully presented.
            </p>
          </div>

          <div className="value-card">
            <div className="value-number">04</div>
            <h3>Trust</h3>
            <p>
              We aim to build lasting relationships with
              our customers through a reliable shopping experience.
            </p>
          </div>

        </div>

      </section>


      {/* MISSION */}
      <section className="about-mission">

        <div className="mission-content">
          <p className="about-label">OUR MISSION</p>

          <h2>
            Making Every
            <span> Purchase Matter.</span>
          </h2>

          <p>
            Our mission is to create a shopping platform where
            discovering great products feels effortless, reliable
            and exciting.
          </p>

          <a href="/products" className="mission-button">
            Start Shopping →
          </a>
        </div>

      </section>

    </div>
  );
}

export default About;