import { Link } from "react-router-dom";
import "./Categories.css";

function Categories() {
  const categories = [
    {
      name: "Fashion",
      description: "Trendy styles for every occasion.",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
      className: "fashion",
    },
    {
      name: "Electronics",
      description: "Smart gadgets and modern technology.",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
      className: "electronics",
    },
    {
      name: "Home & Living",
      description: "Beautiful pieces for your space.",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
      className: "home",
    },
    {
      name: "Beauty",
      description: "Beauty, skincare and self-care essentials.",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
      className: "beauty",
    },
    {
      name: "Accessories",
      description: "The details that complete your look.",
      image:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
      className: "accessories",
    },
    {
      name: "Sports",
      description: "Gear up and stay active.",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
      className: "sports",
    },
  ];

  return (
    <div className="categories-page">

      <section className="categories-hero">
        <p className="categories-label">
          EXPLORE LUXECART
        </p>

        <h1>
          Shop by <span>Category</span>
        </h1>

        <p className="categories-intro">
          Discover a world of carefully selected products,
          curated to bring style, quality and convenience together.
        </p>
      </section>

      <section className="categories-grid">

        {categories.map((category) => (

          <Link
            key={category.name}
            to={`/products?category=${encodeURIComponent(
              category.name
            )}`}
            className={`category-card ${category.className}`}
          >

            <img
              src={category.image}
              alt={category.name}
            />

            <div className="category-overlay"></div>

            <div className="category-content">

              <p className="category-small">
                SHOP
              </p>

              <h2>
                {category.name}
              </h2>

              <p className="category-description">
                {category.description}
              </p>

              <span className="category-button">
                Explore Collection →
              </span>

            </div>

          </Link>

        ))}

      </section>

    </div>
  );
}

export default Categories;