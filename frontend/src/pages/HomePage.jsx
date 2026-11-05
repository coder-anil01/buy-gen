import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../style/HomePage.css";
import OptimizedImage from "../components/OptimizedImage";
import optimizeImage from "../utils/optimizeImage";
import{ Helmet } from "react-helmet-async";

const banners = [
  {
    eyebrow: "BIG SAVINGS. BIGGER SMILES.",
    title: "Top Deals on",
    highlight: "Mobiles & Electronics",
    subtitle: "Smartphones, laptops and everyday essentials at great prices.",
    offer: "UP TO 50% OFF",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000",
    className: "homepage-banner-blue",
    path: "/category/electronics",
  },
  {
    eyebrow: "STYLE FOR EVERYONE",
    title: "Refresh Your",
    highlight: "Everyday Fashion",
    subtitle: "Discover fresh looks for men, women and kids.",
    offer: "UP TO 70% OFF",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000",
    className: "homepage-banner-pink",
    path: "/offers/mega-sale",
  },
  {
    eyebrow: "MAKE YOUR HOME SPECIAL",
    title: "Upgrade Your",
    highlight: "Living Space",
    subtitle: "Find home essentials, appliances and more.",
    offer: "DEALS FROM ₹199",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000",
    className: "homepage-banner-green",
    path: "/category/home-kitchen",
  },
];

const benefits = [
  { icon: "🚚", title: "Free Shipping", subtitle: "On eligible orders" },
  { icon: "↩", title: "7 Days Return", subtitle: "Easy return policy" },
  { icon: "💵", title: "Cash on Delivery", subtitle: "Pay at your doorstep" },
  { icon: "🏷️", title: "Best Prices", subtitle: "More value for money" },
];

const formatPrice = (price) => {
  if (price == null || price === "" || !Number.isFinite(Number(price))) {
    return "Price unavailable";
  }

  return `₹${Number(price).toLocaleString("en-IN")}`;
};

// Reusable skeleton block
function Skeleton({ className = "" }) {
  return <div className={`homepage-skeleton ${className}`} />;
}

// Hero skeleton
function HeroSkeleton() {
  return (
    <section className="homepage-hero">
      <div className="homepage-hero-skeleton">
        <div className="hero-skeleton-content">
          <Skeleton className="skeleton-eyebrow" />
          <Skeleton className="skeleton-title" />
          <Skeleton className="skeleton-title short" />
          <Skeleton className="skeleton-description" />
          <Skeleton className="skeleton-button" />
        </div>
        <Skeleton className="hero-skeleton-image" />
      </div>
    </section>
  );
}

// Category skeleton
function CategorySkeleton() {
  return (
    <section className="homepage-section">
      <div className="homepage-section-heading">
        <div>
          <h2>Shop by Category</h2>
          <p>Find your favourites in one place</p>
        </div>
      </div>

      <div className="homepage-slider-track">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="category-skeleton-card" key={i}>
            <Skeleton className="category-skeleton-image" />
            <Skeleton className="category-skeleton-text" />
          </div>
        ))}
      </div>
    </section>
  );
}

// BenefitsSkeleton
function BenefitsSkeleton() {
  return (
    <div className="benefits-grid benefits-skeleton-grid">
      {[1, 2, 3, 4].map((item) => (
        <div className="benefit-card benefit-skeleton-card" key={item}>
          <Skeleton className="benefit-skeleton-icon" />

          <div className="benefit-skeleton-content">
            <Skeleton className="benefit-skeleton-title" />
            <Skeleton className="benefit-skeleton-text" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Product card skeleton
function ProductCardSkeleton() {
  return (
    <div className="homepage-product-card product-skeleton-card">
      <Skeleton className="product-skeleton-image" />

      <div className="product-skeleton-info">
        <Skeleton className="product-skeleton-title" />
        <Skeleton className="product-skeleton-price" />
        <Skeleton className="product-skeleton-rating" />
      </div>
    </div>
  );
}

// Product section skeleton
function ProductSectionSkeleton({ title }) {
  return (
    <section className="homepage-section homepage-products">
      <div className="homepage-section-heading">
        <div>
          <h2>{title}</h2>
          <Skeleton className="skeleton-subtitle" />
        </div>
        <Skeleton className="skeleton-swipe" />
      </div>

      <div className="homepage-slider-track">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

// Reusable horizontal slider
function HomeSlider({ title, subtitle, children, className = "" }) {
  return (
    <section className={`homepage-section ${className}`}>
      <div className="homepage-section-heading">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>

        <span className="homepage-swipe-hint">Swipe to explore →</span>
      </div>

      <div className="homepage-slider-viewport">
        <div className="homepage-slider-track">{children}</div>
      </div>
    </section>
  );
}

// Reusable product card
function ProductCard({ product }) {
  return (
    <article className="homepage-product-card">
      <Link
        to={`/product/${product._id}`}
        className="homepage-product-link"
        draggable="false"
      >
        <div className="homepage-product-image">
          {product?.bogoOffers?.[0] && (
            // {badge && (
            //   <span className="homepage-discount">{badge}</span>
            <span className="homepage-discount">
              {/* {badge} */}
              {`Buy${product?.bogoOffers[0]?.buyQuantity}Get${product?.bogoOffers[0]?.getQuantity}`}
            </span>
          )}
          <OptimizedImage
            src={optimizeImage(product.images?.[0]?.url, 300)}
            alt={product.title || "Product"}
            priority={false}
            draggable="false"
          />
        </div>

        <div className="homepage-product-info">
          <h3>{product.title}</h3>

          <div className="homepage-product-prices">
            <strong>{formatPrice(product.price)}</strong>

            {product.compareAtPrice != null && (
              <del>{formatPrice(product.compareAtPrice)}</del>
            )}
          </div>

          {product.averageRating > 0 ? (
            <div className="homepage-product-rating">
              <span>★</span> {product.averageRating} ({product.totalReviews})
              <small> · Rated by Buyers</small>
            </div>
          ) : (
            <div className="homepage-product-rating">
              <small>Not Rated by any Buyers</small>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

// Reusable product section
function ProductSection({ title, subtitle, products }) {
  return (
    <HomeSlider title={title} subtitle={subtitle} className="homepage-products">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </HomeSlider>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [loading, setLoading] = useState(true);

  const touchStart = useRef(0);
  const apiDomain = import.meta.env.VITE_API_URL;

  // Get products and categories
  useEffect(() => {
    const getHomeData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          axios.get(`${apiDomain}/api/v1/product/get`),
          axios.get(`${apiDomain}/api/v1/category/get`),
        ]);

        setProducts(productRes.data.products || []);
        setCategories(categoryRes.data.categories || []);
      } catch (error) {
        console.error("Homepage API error:", error);
      } finally {
        setLoading(false);
      }
    };

    getHomeData();
  }, [apiDomain]);

  // Banner autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((current) => (current + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Change banner with swipe
  const handleTouchEnd = (event) => {
    const distance = touchStart.current - event.changedTouches[0].clientX;

    if (Math.abs(distance) > 45) {
      setActiveBanner(
        (current) =>
          (current + (distance > 0 ? 1 : -1) + banners.length) % banners.length,
      );
    }
  };

  return (
    <>
    <Helmet>
      <title>Home - BuyGen</title>
      <meta name="description" content="Welcome to BuyGen, your one-stop destination for all your shopping needs." />
      <meta name="keywords" content="BuyGen, online shopping, e-commerce, deals, discounts, products" />
      <meta name="author" content="BuyGen Team" />
      <meta property="og:title" content="Home - BuyGen" />
    </Helmet>
    <main className="homepage">
      {/* Hero Banner */}
      {/* <section className="homepage-hero">
        <div
          className={`homepage-hero-banner ${banners[activeBanner].className}`}
          onTouchStart={(event) => {
            touchStart.current = event.touches[0].clientX;
          }}
          onTouchEnd={handleTouchEnd}
        >
          <div className="homepage-hero-content">
            <span className="homepage-hero-eyebrow">
              {banners[activeBanner].eyebrow}
            </span>

            <h1>
              {banners[activeBanner].title}
              <strong>{banners[activeBanner].highlight}</strong>
            </h1>

            <p>{banners[activeBanner].subtitle}</p>

            <Link
              to={banners[activeBanner].path}
              className="homepage-shop-button"
            >
              Shop Now →
            </Link>
          </div>

          <div className="homepage-hero-image">
            <img
              src={banners[activeBanner].image}
              alt={banners[activeBanner].highlight}
              draggable="false"
            />

            <div className="homepage-hero-offer">
              {banners[activeBanner].offer}
            </div>
          </div>
        </div>

        <div className="homepage-hero-dots">
          {banners.map((banner, index) => (
            <button
              key={banner.highlight}
              type="button"
              aria-label={`Show banner ${index + 1}`}
              className={
                activeBanner === index ? "homepage-dot-active" : ""
              }
              onClick={() => setActiveBanner(index)}
            />
          ))}
        </div>
      </section> */}

      {/* Hero Banner */}
      {loading ? (
        <HeroSkeleton />
      ) : (
        <section className="homepage-hero">
          <div
            className={`homepage-hero-banner ${banners[activeBanner].className}`}
            onTouchStart={(event) => {
              touchStart.current = event.touches[0].clientX;
            }}
            onTouchEnd={handleTouchEnd}
          >
            <div className="homepage-hero-content">
              <span className="homepage-hero-eyebrow">
                {banners[activeBanner].eyebrow}
              </span>

              <h1>
                {banners[activeBanner].title}
                <strong>{banners[activeBanner].highlight}</strong>
              </h1>

              <p>{banners[activeBanner].subtitle}</p>

              <Link
                to={banners[activeBanner].path}
                className="homepage-shop-button"
              >
                Shop Now →
              </Link>
            </div>

            <div className="homepage-hero-image">
              <img
                src={banners[activeBanner].image}
                alt={banners[activeBanner].highlight}
              />

              <div className="homepage-hero-offer">
                {banners[activeBanner].offer}
              </div>
            </div>
          </div>

          <div className="homepage-hero-dots">
            {banners.map((banner, index) => (
              <button
                key={banner.highlight}
                type="button"
                aria-label={`Show banner ${index + 1}`}
                className={activeBanner === index ? "homepage-dot-active" : ""}
                onClick={() => setActiveBanner(index)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {/* {!loading && categories.length > 0 && (
        <HomeSlider
          title="Shop by Category"
          subtitle="Find your favourites in one place"
          className="homepage-categories"
        >
          {categories.map((category) => (
            <Link
              to={`/category/${category._id}`}
              className="homepage-category-card"
              key={category._id}
              draggable="false"
            >
              <div className="homepage-category-image">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  draggable="false"
                />
              </div>

              <span>{category.name}</span>
            </Link>
          ))}
        </HomeSlider>
      )} */}

      {loading ? (
        <CategorySkeleton />
      ) : categories.length > 0 ? (
        <HomeSlider
          title="Shop by Category"
          subtitle="Find your favourites in one place"
          className="homepage-categories"
        >
          {categories.map((category) => (
            <Link
              to={`/category/${category._id}`}
              className="homepage-category-card"
              key={category._id}
            >
              <div className="homepage-category-image">
                <OptimizedImage
                  src={optimizeImage(category?.image, 100)}
                  alt={category?.name || "Category"}
                  priority={false}
                  draggable="false"
                />
              </div>
              <span>{category?.name}</span>
            </Link>
          ))}
        </HomeSlider>
      ) : null}

      {/* Benefits */}
      <section className="benefits-section">
        {loading ? (
          <BenefitsSkeleton />
        ) : (
          <section className="homepage-benefits">
            {benefits.map((benefit) => (
              <div className="homepage-benefit" key={benefit.title}>
                <div className="homepage-benefit-icon">{benefit.icon}</div>

                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.subtitle}</p>
                </div>
              </div>
            ))}
          </section>
        )}
      </section>

      {/* Best Sellers */}
      {/* {products.length > 0 && (
        <ProductSection
          title="Best Sellers"
          subtitle="The products everyone keeps coming back for."
          products={products}
        />
      )} */}

      {/* Special Offers */}
      {/* {products.length > 0 && (
        <ProductSection
          title="Special Offers"
          subtitle="Explore limited-time deals and exclusive savings."
          products={products}
        />
      )} */}

      {/* Best Sellers */}
      {loading ? (
        <ProductSectionSkeleton title="Best Sellers" />
      ) : products.length > 0 ? (
        <ProductSection
          title="Best Sellers"
          subtitle="The products everyone keeps coming back for."
          products={products}
        />
      ) : null}

      {/* Special Offers */}
      {loading ? (
        <ProductSectionSkeleton title="Special Offers" />
      ) : products.length > 0 ? (
        <ProductSection
          title="Special Offers"
          subtitle="Explore limited-time deals and exclusive savings."
          products={products}
        />
      ) : null}

      {/* New Arrivals */}
      {loading ? (
        <ProductSectionSkeleton title="New Arrivals" />
      ) : products.length > 0 ? (
        <ProductSection
          title="New Arrivals"
          subtitle="Fresh finds, newly added to your collection."
          products={products}
        />
      ) : null}

      {/* New Arrivals */}
      {/* {products.length > 0 && (
        <ProductSection
          title="New Arrivals"
          subtitle="Fresh finds, newly added to your collection."
          products={products}
          badge="New"
        />
      )} */}

      {/* Buy One Get One Banner */}
      {/* <section className="homepage-bogo-banner">
        <div className="homepage-bogo-content">
          <span>DOUBLE THE JOY</span>
          <h2>Buy 1, Get 1 Free</h2>
          <p>More of what you love on eligible products.</p>

          <Link to="/offers/buy-one-get-one">
            Discover the offer →
          </Link>
        </div>

        <div className="homepage-bogo-visual" aria-hidden="true">
          <span>1</span>
          <span>+</span>
          <span>1</span>
        </div>
      </section> */}

      {/* Feature Banners */}
      {/* <section className="homepage-feature-grid">
        <Link
          to="/category/fashion"
          className="homepage-feature-card homepage-feature-fashion"
        >
          <div>
            <span>NEW SEASON COLLECTION</span>
            <h2>Fashion for Everyone</h2>
            <p>Fresh styles. Everyday prices.</p>
            <strong>Shop Fashion →</strong>
          </div>

          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600"
            alt="Fashion collection"
            loading="lazy"
          />
        </Link>

        <Link
          to="/category/home-kitchen"
          className="homepage-feature-card homepage-feature-home"
        >
          <div>
            <span>MAKE YOUR SPACE BETTER</span>
            <h2>Upgrade Your Home</h2>
            <p>Comfort for every corner.</p>
            <strong>Shop Home →</strong>
          </div>

          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600"
            alt="Home collection"
            loading="lazy"
          />
        </Link>
      </section> */}

      {/* Trust Section */}
      {/* <section className="homepage-trust-strip">
        <div>
          <span>🔒</span>
          <p>
            <strong>Secure Shopping</strong>
            <small>Your shopping experience matters</small>
          </p>
        </div>

        <div>
          <span>💳</span>
          <p>
            <strong>Flexible Payments</strong>
            <small>Available payment options at checkout</small>
          </p>
        </div>

        <div>
          <span>🎧</span>
          <p>
            <strong>Customer Support</strong>
            <small>We're here to help</small>
          </p>
        </div>
      </section> */}
    </main>
    </>
  );
}
