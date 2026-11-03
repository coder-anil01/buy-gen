import axios from "axios";
import "../style/HomePage.css";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

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
  {
    icon: "🚚",
    title: "Free Shipping",
    subtitle: "On eligible orders",
  },
  {
    icon: "↩",
    title: "7 Days Return",
    subtitle: "Easy return policy",
  },
  {
    icon: "💵",
    title: "Cash on Delivery",
    subtitle: "Pay at your doorstep",
  },
  {
    icon: "🏷️",
    title: "Best Prices",
    subtitle: "More value for money",
  },
];

const offers = [
  {
    tag: "SPECIAL OFFER",
    title: "BUY 1 GET 1 FREE",
    description: "Double the joy on Skin Care products.",
    action: "Shop the offer",
    path: "/offers/buy-one-get-one",
    className: "homepage-offer-bogo",
    symbol: "🎁",
  },
  {
    tag: "MEGA SALE",
    title: "UP TO 70% OFF",
    description: "Big savings on selected collections.",
    action: "Explore the sale",
    path: "/offers/mega-sale",
    className: "homepage-offer-sale",
    symbol: "⚡",
  },
  {
    tag: "LIMITED-TIME DEALS",
    title: "FLASH SALE",
    description: "Discover today's special prices.",
    action: "Grab a deal",
    path: "/offers/flash-sale",
    className: "homepage-offer-flash",
    symbol: "🔥",
  },
];

const formatPrice = (price) => {
  const amount = Number(price);
  if (price == null || price === "" || !Number.isFinite(amount)) {
    return "Price unavailable";
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

function HomepageSlider({ title, subtitle, children, className = "" }) {
  const sliderRef = useRef(null);
  const dragRef = useRef({
    down: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const handlePointerDown = (event) => {
    if (event.pointerType === "touch") return;
    if (event.button !== 0) return;

    dragRef.current = {
      down: true,
      startX: event.clientX,
      scrollLeft: sliderRef.current.scrollLeft,
      moved: false,
    };

    sliderRef.current.classList.add("homepage-is-dragging");
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current.down || !sliderRef.current) return;

    const distance = event.clientX - dragRef.current.startX;

    if (Math.abs(distance) > 5) {
      dragRef.current.moved = true;
    }

    sliderRef.current.scrollLeft = dragRef.current.scrollLeft - distance;
  };

  const handlePointerUp = () => {
    dragRef.current.down = false;
    sliderRef.current?.classList.remove("homepage-is-dragging");

    if (dragRef.current.moved) {
      window.setTimeout(() => {
        dragRef.current.moved = false;
      }, 80);
    }
  };

  const preventDraggedClick = (event) => {
    if (dragRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      dragRef.current.moved = false;
    }
  };

  return (
    <section className={`homepage-section ${className}`}>
      <div className="homepage-section-heading">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
          <span className="homepage-heading-line" />
        </div>

        <span className="homepage-swipe-hint">
          Swipe to explore <span>→</span>
        </span>
      </div>

      <div className="homepage-slider-viewport">
        <div
          className="homepage-slider-track"
          ref={sliderRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClickCapture={preventDraggedClick}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

// export default function HomePage() {
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const apiDomain = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getallProducts = async () => {
      try {
        const res = await axios.get(`${apiDomain}/api/v1/product/get`);
        console.log(res);
        setProducts(res.data.products);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllCategory = async () => {
      try {
        const { data } = await axios.get(`${apiDomain}/api/v1/category/get`);
        setCategories(data.categories);
        console.log(data.categories);
      } catch (error) {
        console.log(error);
      }
    };
    getAllCategory();
    getallProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeBanner, setActiveBanner] = useState(0);
  const bannerTouchStart = useRef(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % banners.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const changeBanner = (direction) => {
    setActiveBanner(
      (current) => (current + direction + banners.length) % banners.length,
    );
  };

  const handleBannerTouchStart = (event) => {
    bannerTouchStart.current = event.touches[0].clientX;
  };

  const handleBannerTouchEnd = (event) => {
    const difference =
      bannerTouchStart.current - event.changedTouches[0].clientX;

    if (Math.abs(difference) > 45) {
      changeBanner(difference > 0 ? 1 : -1);
    }
  };

  return (
    <main className="homepage">
      {/* HERO BANNER SLIDER */}

      <section className="homepage-hero">
        <div
          className={`homepage-hero-banner ${banners[activeBanner].className}`}
          onTouchStart={handleBannerTouchStart}
          onTouchEnd={handleBannerTouchEnd}
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
              Shop Now <span>→</span>
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
              type="button"
              key={banner.highlight}
              aria-label={`Show banner ${index + 1}`}
              className={activeBanner === index ? "homepage-dot-active" : ""}
              onClick={() => setActiveBanner(index)}
            />
          ))}
        </div>
      </section>

      {/* Exp */}


      


      {/* <section className="homepage-offer-strip">
        {offers.map((offer) => (
          <article
            className={`homepage-offer-card ${offer.className}`}
            key={offer.title}
          >
            <div className="homepage-offer-copy">
              <span className="homepage-offer-tag">{offer.tag}</span>
              <h2>{offer.title}</h2>
              <p>{offer.description}</p>

              <Link to={offer.path} className="homepage-offer-link">
                {offer.action} <span>→</span>
              </Link>
            </div>

            <div className="homepage-offer-symbol" aria-hidden="true">
              {offer.symbol}
            </div>
          </article>
        ))}
      </section> */}

      {/* CATEGORY SLIDER */}

      {categories.length > 0 ?
      <HomepageSlider
        title="Shop by Category"
        subtitle="Find your favourites in one place"
        className="homepage-categories"
      >
        {categories.map((category, index) => (
          <Link
            to={`/category/${category._id}`}
            className="homepage-category-card"
            key={index}
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
            <span>{category.name || "empty"}</span>
          </Link>
        ))}
      </HomepageSlider>
      : "Loading..."}

      {/* Best Sellers */}
      {products.length > 0 ? (
        <HomepageSlider
          title="Best Sellers"
          subtitle="The products everyone keeps coming back for."
          className="homepage-products"
        >
          {products?.map((product, index) => (
            <article key={index} className="homepage-product-card">
              <Link
                to={`/product/${product?._id}`}
                className="homepage-product-link"
                draggable="false"
              >
                <div className="homepage-product-image">
                  <span className="homepage-discount">
                    {/* {product.discount} */}
                    {/* 60% OFF */}
                    B1G1 Free
                  </span>

                  {/* <span className="homepage-product-badge">
                    BESTSELLER
                  </span> */}
                  <img
                    src={product?.images?.[0]?.url || "/placeholder.png"}
                    alt={product?.title}
                    loading="lazy"
                    draggable="false"
                  />
                </div>

                <div className="homepage-product-info">
                  <h3>{product?.title}</h3>

                  <div className="homepage-product-prices">
                    <strong>{formatPrice(product?.price)}</strong>
                    <del>{formatPrice(product?.compareAtPrice)}</del>
                  </div>

                  {product?.averageRating > 0 ?
                  <div className="homepage-product-rating">
                    <span>★</span> {product?.averageRating} ({product?.totalReviews})
                    <small> · Rated by Buyers</small>
                  </div> :
                  <div className="homepage-product-rating">
                    {/* <span>★</span> {product?.averageRating} ({product?.totalReviews}) */}
                    <small>Not Rated by any Buyers</small>
                  </div>
                  }
                </div>
              </Link>

              {/* <Link
                to={`/product/${product?._id}`}
                className="homepage-product-button"
              >
                View Product
              </Link> */}
            </article>
          ))}
        </HomepageSlider>
      ) : (
        "Loading..."
      )}

      {/* BUY some GET some Free */}
      {products.length > 0 ? (
        <HomepageSlider
          
          title="Special Offers"
          subtitle="Explore limited-time deals and exclusive savings."
          className="homepage-products"
        >
          {products?.map((product, index) => (
            <article key={index} className="homepage-product-card">
              <Link
                to={`/product/${product?._id}`}
                className="homepage-product-link"
                draggable="false"
              >
                <div className="homepage-product-image">
                  <span className="homepage-discount">
                    {/* {product.discount} */}
                    {/* 60% OFF */}
                    B2G3 Free
                  </span>

                  <img
                    src={product?.images?.[0]?.url || "/placeholder.png"}
                    // src="https://res.cloudinary.com/pbykkmdq/image/upload/v1791168098/i2a6aflwijja7dp74plp.webp"
                    alt={product?.title}
                    loading="lazy"
                    draggable="false"
                  />
                </div>

                <div className="homepage-product-info">
                  <h3>{product?.title}</h3>

                  <div className="homepage-product-prices">
                    <strong>{formatPrice(product?.price)}</strong>
                    <del>{formatPrice(product?.compareAtPrice)}</del>
                  </div>

                  {product?.averageRating > 0 ?
                  <div className="homepage-product-rating">
                    <span>★</span> {product?.averageRating} ({product?.totalReviews})
                    <small> · Rated by Buyers</small>
                  </div> :
                  <div className="homepage-product-rating">
                    {/* <span>★</span> {product?.averageRating} ({product?.totalReviews}) */}
                    <small>Not Rated by any Buyers</small>
                  </div>
                  }
                </div>
              </Link>

              {/* <Link
                to={`/product/${product?._id}`}
                className="homepage-product-button"
              >
                View Product
              </Link> */}
            </article>
          ))}
        </HomepageSlider>
      ) : (
        "Loading..."
      )}

      {/* COMPANY BENEFITS */}
      <section className="homepage-benefits">
        {benefits.map((benefit, index) => (
          <div className="homepage-benefit" key={index}>
            <div className="homepage-benefit-icon">{benefit.icon}</div>
            <div>
              <h3>{benefit.title}</h3>
              <p>{benefit.subtitle}</p>
            </div>
          </div>
        ))}
      </section>

      {/* DAILY DEALS PRODUCT SLIDER */}

      {products.length > 0 ? (
        <HomepageSlider
          title="New Arrivals"
          subtitle="Fresh finds, newly added to your collection."
          className="homepage-products"
        >
          {products?.map((product, index) => (
            <article key={index} className="homepage-product-card">
              <Link
                to={`/product/${product?._id}`}
                className="homepage-product-link"
                draggable="false"
              >
                <div className="homepage-product-image">
                  <span className="homepage-discount">
                    {/* {product.discount} */}
                    60% OFF
                  </span>

                  <img
                    src={product?.images?.[0]?.url || "/placeholder.png"}
                    // src="https://res.cloudinary.com/pbykkmdq/image/upload/v1791168098/i2a6aflwijja7dp74plp.webp"
                    alt={product?.title}
                    loading="lazy"
                    draggable="false"
                  />
                </div>

                <div className="homepage-product-info">
                  <h3>{product?.title}</h3>

                  <div className="homepage-product-prices">
                    <strong>{formatPrice(product?.price)}</strong>
                    <del>{formatPrice(product?.compareAtPrice)}</del>
                  </div>

                  {product?.averageRating > 0 &&
                  <div className="homepage-product-rating">
                    <span>★</span> {product?.averageRating} ({product?.totalReviews})
                    <small> · Rated by Buyers</small>
                  </div>
                  }
                </div>
              </Link>

              {/* <Link
                to={`/product/${product?._id}`}
                className="homepage-product-button"
              >
                View Product
              </Link> */}
            </article>
          ))}
        </HomepageSlider>
      ) : (
        "Loading..."
      )}

      {/* BUY ONE GET ONE PROMOTION */}
      <section className="homepage-bogo-banner">
        <div className="homepage-bogo-content">
          <span>DOUBLE THE JOY</span>
          <h2>Buy 1, Get 1 Free</h2>
          <p>More of what you love on eligible products.</p>
          <Link to="/offers/buy-one-get-one">
            Discover the offer <span>→</span>
          </Link>
        </div>

        <div className="homepage-bogo-visual" aria-hidden="true">
          <span>1</span>
          <span>+</span>
          <span>1</span>
        </div>
      </section>

      {/* BRAND STRIP */}
      {/* <section className="homepage-section homepage-brands">
        <div className="homepage-section-heading">
          <div>
            <h2>Popular Brands</h2>
            <p>Explore products from popular names</p>
            <span className="homepage-heading-line" />
          </div>

          <span className="homepage-swipe-hint">
            Swipe to explore <span>→</span>
          </span>
        </div>

        <div className="homepage-brand-track">
          {brands.map((brand) => (
            <div className="homepage-brand-card" key={brand}>
              {brand}
            </div>
          ))}
        </div>
      </section> */}

      {/* FEATURE BANNERS */}

      <section className="homepage-feature-grid">
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
      </section>

      {/* TRUST STRIP */}

      <section className="homepage-trust-strip">
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
      </section>
    </main>
  );
};

export default HomePage;
