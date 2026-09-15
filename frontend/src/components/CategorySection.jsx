import { Link } from "react-router-dom";
import "./CategorySection.css";

const categories = [
  {
    name: "Fashion",
    description: "Elevate your everyday style",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Accessories",
    description: "The details that complete the look",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Footwear",
    description: "Step into something exceptional",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
  },
];

function CategorySection() {
  return (
    <section className="category-section">

      <div className="category-heading">
        <p>EXPLORE</p>

        <h2>Shop by Category</h2>

        <span>
          Find something made for your style, your space and your everyday
          moments.
        </span>
      </div>

      <div className="category-grid">

        {categories.map((category) => (
          <article
            className="category-card"
            key={category.name}
          >

            <img
              src={category.image}
              alt={category.name}
            />

            <div className="category-overlay">

              <p>{category.description}</p>

              <h3>{category.name}</h3>

              <Link
                to={`/products?category=${encodeURIComponent(
                  category.name
                )}`}
                className="category-explore-button"
              >
                Explore →
              </Link>

            </div>

          </article>
        ))}

      </div>

    </section>
  );
}

export default CategorySection;