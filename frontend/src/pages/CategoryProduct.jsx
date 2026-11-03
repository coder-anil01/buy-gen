// import { useEffect, useMemo, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import {
//   FiArrowLeft,
//   FiSearch,
//   FiShoppingBag,
// } from "react-icons/fi";
import "../style/CategoryProducts.css";

// const apiDomain = import.meta.env.VITE_API_URL;

// const getId = (value) => {
//   if (!value) return "";
//   if (typeof value === "string") return value;
//   return String(value._id || value.id || "");
// };

// const getImage = (product) => {
//   const image = product?.images?.[0];
//   if (typeof image === "string") return image;

//   return image?.url || product?.image?.url || "";
// };

// const formatPrice = (value) => {
//   const price = Number(value);

//   if (!Number.isFinite(price)) return "₹—";

//   return `₹${price.toLocaleString("en-IN")}`;
// };

// const ProductSkeleton = () => (
//   <div className="cp-skeleton">
//     <div className="cp-skeleton-img" />
//     <div className="cp-skeleton-line" />
//     <div className="cp-skeleton-line short" />
//     <div className="cp-skeleton-line price" />
//   </div>
// );

// export default function CategoryProducts() {
//   const { id } = useParams();

//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("recommended");

//   useEffect(() => {
//     let active = true;

//     const loadData = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const [productResponse, categoryResponse] =
//           await Promise.all([
//             fetch(`${apiDomain}/api/v1/product/get`),
//             fetch(`${apiDomain}/api/v1/category/get`),
//           ]);

//         if (!productResponse.ok || !categoryResponse.ok) {
//           throw new Error("Unable to load category products.");
//         }

//         const [productData, categoryData] = await Promise.all([
//           productResponse.json(),
//           categoryResponse.json(),
//         ]);

//         if (
//           productData?.success === false ||
//           categoryData?.success === false
//         ) {
//           throw new Error("Unable to load category products.");
//         }

//         if (!active) return;

//         setProducts(
//           Array.isArray(productData?.products)
//             ? productData.products
//             : []
//         );

//         setCategories(
//           Array.isArray(categoryData?.categories)
//             ? categoryData.categories
//             : []
//         );
//       } catch (err) {
//         if (active) {
//           setError(err.message || "Something went wrong.");
//         }
//       } finally {
//         if (active) setLoading(false);
//       }
//     };

//     loadData();

//     return () => {
//       active = false;
//     };
//   }, [id]);

//   // Find current category by ID or slug
//   const category = useMemo(() => {
//     return categories.find(
//       (item) =>
//         getId(item) === id ||
//         String(item?.slug || "") === id
//     );
//   }, [categories, id]);

//   // Filter, search and sort products
//   const visibleProducts = useMemo(() => {
//     let result = products.filter((product) => {
//       const productCategory = product?.category;
//       const productCategoryId = getId(productCategory);

//       return (
//         productCategoryId === id ||
//         (category &&
//           productCategoryId === getId(category))
//       );
//     });

//     const query = search.trim().toLowerCase();

//     if (query) {
//       result = result.filter((product) =>
//         `${product?.title || ""} ${
//           product?.description || ""
//         }`
//           .toLowerCase()
//           .includes(query)
//       );
//     }

//     if (sort === "price-low") {
//       result = [...result].sort(
//         (a, b) =>
//           Number(a.price || 0) -
//           Number(b.price || 0)
//       );
//     }

//     if (sort === "price-high") {
//       result = [...result].sort(
//         (a, b) =>
//           Number(b.price || 0) -
//           Number(a.price || 0)
//       );
//     }

//     if (sort === "newest") {
//       result = [...result].sort(
//         (a, b) =>
//           new Date(b.createdAt || 0).getTime() -
//           new Date(a.createdAt || 0).getTime()
//       );
//     }

//     return result;
//   }, [products, id, category, search, sort]);

//   return (
//     <main className="category-products-page">
//       {/* Breadcrumb */}
//       <nav className="cp-breadcrumb">
//         <Link to="/categories">
//           <FiArrowLeft />
//           All categories
//         </Link>

//         <span>/</span>

//         <span>
//           {category?.name || "Category products"}
//         </span>
//       </nav>

//       {/* Category heading */}
//       <header className="cp-header">
//         <div>
//           <span className="cp-eyebrow">
//             Explore the collection
//           </span>

//           <h1>
//             {category?.name || "Shop category"}
//           </h1>

//           <p>
//             Find the right pick for your style and
//             everyday needs.
//           </p>
//         </div>

//         <div className="cp-header-icon">
//           <FiShoppingBag />
//         </div>
//       </header>

//       <section className="cp-content">
//         {/* Toolbar */}
//         <div className="cp-toolbar">
//           <div className="cp-result-count">
//             <h2>Products</h2>

//             {!loading && (
//               <span>
//                 {visibleProducts.length} items
//               </span>
//             )}
//           </div>

//           <div className="cp-controls">
//             <label className="cp-search">
//               <FiSearch />

//               <input
//                 type="search"
//                 value={search}
//                 onChange={(e) =>
//                   setSearch(e.target.value)
//                 }
//                 placeholder="Search products"
//                 aria-label="Search products in this category"
//               />
//             </label>

//             <select
//               value={sort}
//               onChange={(e) => setSort(e.target.value)}
//               aria-label="Sort products"
//             >
//               <option value="recommended">
//                 Recommended
//               </option>

//               <option value="newest">
//                 Newest
//               </option>

//               <option value="price-low">
//                 Price: Low to high
//               </option>

//               <option value="price-high">
//                 Price: High to low
//               </option>
//             </select>
//           </div>
//         </div>

//         {/* Skeleton loading */}
//         {loading ? (
//           <div className="cp-grid">
//             {Array.from({ length: 8 }).map((_, i) => (
//               <ProductSkeleton key={i} />
//             ))}
//           </div>
//         ) : error ? (
//           <div className="cp-state">
//             <h3>Unable to load products</h3>
//             <p>{error}</p>

//             <button
//               type="button"
//               onClick={() => window.location.reload()}
//             >
//               Try again
//             </button>
//           </div>
//         ) : visibleProducts.length === 0 ? (
//           <div className="cp-state">
//             <div className="cp-empty-icon">
//               <FiShoppingBag />
//             </div>

//             <h3>
//               {search
//                 ? "No products match your search"
//                 : "No products found"}
//             </h3>

//             <p>
//               {search
//                 ? "Try a different product name."
//                 : "There are no products listed in this category yet."}
//             </p>
//           </div>
//         ) : (
//           <div className="cp-grid">
//             {visibleProducts.map((product) => {
//               const image = getImage(product);
//               const productId = getId(product);

//               const price = Number(product?.price);
//               const compare = Number(
//                 product?.compareAtPrice
//               );

//               const discount =
//                 compare > price && price > 0
//                   ? Math.round(
//                       ((compare - price) / compare) * 100
//                     )
//                   : 0;

//               return (
//                 <Link
//                   to={`/product/${productId}`}
//                   className="cp-product-card"
//                   key={productId}
//                 >
//                   <div className="cp-product-image">
//                     {image ? (
//                       <img
//                         src={image}
//                         alt={product?.title || "Product"}
//                         loading="lazy"
//                       />
//                     ) : (
//                       <div className="cp-image-placeholder">
//                         <FiShoppingBag />
//                       </div>
//                     )}

//                     {discount > 0 && (
//                       <span className="cp-discount">
//                         {discount}% OFF
//                       </span>
//                     )}
//                   </div>

//                   <div className="cp-product-info">
//                     <h3>
//                       {product?.title || "Untitled product"}
//                     </h3>

//                     <div className="cp-prices">
//                       <strong>
//                         {formatPrice(product?.price)}
//                       </strong>

//                       {discount > 0 && (
//                         <del>
//                           {formatPrice(
//                             product?.compareAtPrice
//                           )}
//                         </del>
//                       )}
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }






import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const apiDomain = import.meta.env.VITE_API_URL;

const CategoryProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await axios.get(`${apiDomain}/api/v1/product/category/${id}`);

        // API response ke according data adjust kar sakte ho
        const productList = Array.isArray(data) ? data : data?.product || [];
        console.log(productList);
        setProducts(productList);
      } catch (err) {
        console.error("Category products error:", err);
        setError(
          err.response?.data?.message ||
            "Products load nahi ho paye. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategoryProducts();
    } else {
      setProducts([]);
      setLoading(false);
      setError("Category ID nahi mili.");
    }
  }, [id]);

  const getImage = (product) => {
    if (Array.isArray(product?.images)) {
      return (
        product.images.find((image) => image?.isPrimary)?.url ||
        product.images[0]?.url ||
        product.images[0] ||
        ""
      );
    }

    return product?.image?.url || product?.image || "";
  };

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  if (loading) {
    return (
      <div className="category-products-page">
        <div className="category-products-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="category-product-skeleton" key={index}>
              <div className="skeleton-image" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
              <div className="skeleton-line price" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-product-message">
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => navigate(0)}>Try Again</button>
      </div>
    );
  }

  return (
    <main className="category-products-page">
      <div className="category-products-heading">
        <div>
          <h1>Category Products</h1>
          <p>
            Explore products from this category
          </p>
        </div>

        <span className="category-product-count">
          {products.length} Products
        </span>
      </div>

      {products.length === 0 ? (
        <div className="category-product-empty">
          <div className="empty-icon">🛍️</div>
          <h2>No products found</h2>
          <p>Is category mein abhi koi product available nahi hai.</p>
        </div>
      ) : (
        <div className="category-products-grid">
          {products.map((product) => {
            const image = getImage(product);
            const price = Number(product?.price || 0);
            const comparePrice = Number(
              product?.compareAtPrice || 0
            );

            const discount =
              comparePrice > price && comparePrice > 0
                ? Math.round(
                    ((comparePrice - price) / comparePrice) * 100
                  )
                : 0;

            return (
              <article
                className="category-product-card"
                key={product._id}
                onClick={() =>
                  navigate(`/product/${product._id}`)
                }
              >
                <div className="category-product-image">
                  {discount > 0 && (
                    <span className="category-discount">
                      {discount}% OFF
                    </span>
                  )}

                  {image ? (
                    <img
                      src={image}
                      alt={product.title || "Product"}
                      loading="lazy"
                    />
                  ) : (
                    <div className="category-no-image">
                      No Image
                    </div>
                  )}
                </div>

                <div className="category-product-info">
                  <h3 title={product.title}>
                    {product.title || "Untitled Product"}
                  </h3>

                  {/* {product.description && (
                    <p className="category-product-description">
                      {product.description}
                    </p>
                  )} */}

                  <div className="category-product-prices">
                    <span className="category-current-price">
                      ₹{formatPrice(price)}
                    </span>

                    {comparePrice > price && (
                      <span className="category-old-price">
                        ₹{formatPrice(comparePrice)}
                      </span>
                    )}
                  </div>

                  {/* <button
                    className="category-view-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/product/${product._id}`);
                    }}
                  >
                    View Product
                    <span>→</span>
                  </button> */}
                  <div className="homepage-product-rating">
                    {/* <span>★</span> {product.rating} */}
                    <span>★</span> 4.6{products?.averageRating}
                    <small> · Rated by Buyers</small>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* <div className="category-products-grid">
      {products.map((product) => (
        <ProductCard
        key={product._id}
        product={product}
        />
      ))}
      </div> */}
    </main>
  );
};

export default CategoryProduct;
