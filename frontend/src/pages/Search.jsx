import "../style/Search.css"
// import React, { useEffect, useState } from 'react'
// import { Link, useParams } from 'react-router-dom'
// import axios from 'axios';
// import { FaRegHeart, FaCartPlus } from "react-icons/fa";
// import { useAuth } from '../context/auth';
// import { toast } from 'react-toastify';
// import { Radio } from 'antd';

// const Search = () => {
//   const apiDomain = import.meta.env.VITE_API_URL;
//   const params = useParams();
//   const [auth] = useAuth();
//   const [products, setProducts] = useState([]);
//   const [searchProduct, setSearchProduct] = useState([]);
//   const [sortType, setSortType] = useState('asc');
//   const [filterType, setFilterType] = useState("");
//   const [visable, setVisable] = useState(true);

//   const[visableFilter, setVisableFilter] = useState(false);

//   useEffect(() => {
//     const getAllProducts = async () => {
//     try {
//       const {data} = await axios.post(`${apiDomain}/api/v1/product/search/${params.keyword}`)
//       setProducts(data.products)
//     } catch (error) {
//       console.log(error)
//     }
//   }
//     getAllProducts();
//   },[params?.keyword]);

// // WISHLIST
//   const addToWishlist = async(id) => {
//     try {
//       const {data} = await axios.post(`${apiDomain}/api/v1/wishlist/create` , {product: id, user: auth?.user._id})
//       console.log(data)
//       if(data.success){
//         toast.success(data.message)
//       }else{
//         toast.info(data.message)
//       }
//     } catch (error) {
//       toast.error("Internal Server Error")
//     }
//   }

// // CART
//   const addToCart = async(id) => {
//     try {
//       const {data} = await axios.post(`${apiDomain}/api/v1/cart/create`, {product: id, user: auth?.user._id})
//       if(data.success){
//         toast.success(data.message)
//       }else{
//         toast.info(data.message)
//       }
//     } catch (error) {
//       toast.error("Internal Server Error")
//     }
//   }

//   const handleSortChange = (e) => {
//     const type = e.target.value;
//     let sorted = [...products];
//     if (type === 'asc') {
//       sorted = sorted.sort((a, b) => a.price - b.price);
//     } else if (type === 'desc') {
//       sorted = sorted.sort((a, b) => b.price - a.price);
//     }
//     setVisable(false)
//     setVisableFilter(false)
//     setSearchProduct(sorted)
//     setSortType(type);
//   };

// const handleFilterByPrice = (e) => {
//   const type = e.target.value;
//   let search = [...products];
//   search = search.filter((a) => (a.price <= type ))
//     setVisable(false)
//     setVisableFilter(false)
//     setSearchProduct(search)
//     setFilterType(type)
// }

// const filterVisable = () => {
//   setVisableFilter( visableFilter ? false : true)
// }

//   return (
//     <div className='search-container'>
//       <div className="search-left">
//         <div className="search-left-radio-group-container">
//           <div className="search-left-radio-group-heading">Sorting</div>
//         <Radio.Group className="search-left-radio-group-card" onChange={handleSortChange} value={sortType}>
//           <Radio value="asc">Low to High</Radio>
//           <Radio value="desc">High to Low</Radio>
//         </Radio.Group>
//         </div>
//         <div className="search-left-radio-group-container">
//         <biut className="search-left-radio-group-heading">Filter</biut>
//         <Radio.Group className="search-left-radio-group-card" onChange={handleFilterByPrice} value={filterType} optionType="button" buttonStyle="solid">
//           <Radio value="99">Under 100</Radio>
//           <Radio value="199">Under 200</Radio>
//           <Radio value="499">Under 500</Radio>
//           <Radio value="999">Under 1000</Radio>
//           <Radio value="1499">Under 1500</Radio>
//           <Radio value="1999">Under 2000</Radio>
//           <Radio value="10000"> 5000 + </Radio>
//         </Radio.Group>
//       </div>
//     </div>

// {/* MOBILE */}
// <button className="search-filter-button mid-button-p" onClick={filterVisable}>Filter</button>
//     { visableFilter === true ? <>
//     <div className="search-left-mobile">
//       <div className="search-left-radio-group-container">
//         <div className="search-left-radio-group-heading">Sorting</div>
//         <Radio.Group className="search-left-radio-group-card" onChange={handleSortChange} value={sortType}>
//           <Radio value="asc">Low to High</Radio>
//           <Radio value="desc">High to Low</Radio>
//         </Radio.Group>
//         </div>
//         <div className="search-left-radio-group-container">
//         <biut className="search-left-radio-group-heading">Filter</biut>
//         <Radio.Group className="search-left-radio-group-card" onChange={handleFilterByPrice} value={filterType}>
//           <Radio value="99">Under 100</Radio>
//           <Radio value="199">Under 200</Radio>
//           <Radio value="499">Under 500</Radio>
//           <Radio value="999">Under 1000</Radio>
//           <Radio value="1499">Under 1500</Radio>
//           <Radio value="1999">Under 2000</Radio>
//           <Radio value="10000"> 5000 + </Radio>
//         </Radio.Group>
//       </div>
//     </div>
//     </> : ""}

//       <div>
//         <h3 className="search-product-heading">{searchProduct.length > 0 ? <h3> Found {searchProduct.length} Filter Product</h3>: <>{products.length ? <h3>Found {products.length} Products</h3> : <h3>Product Not Found</h3>} </>}</h3>
//         <div className="product-box">
//         {searchProduct?.map((p) => (
//           <div key={p._id} className="product-box-card">
//             <div className="product-box-image-main">
//               <Link to={`/product/${p._id}`}><img className="product-box-image" src={p.image} alt={p.title.slice(0, 10)}/></Link>
//             </div>
//             <div className="product-box-text">
//               <div className="product-card-icon">
//                 <div className="product-icon-wishlist" onClick={() => {addToWishlist(p._id)}}><FaRegHeart/></div>
//                 <div className="product-icon-cart" onClick={() => {addToCart(p._id)}}><FaCartPlus/></div>
//               </div>
//               <div className="product-box-title">{p.title.slice(0, 15)}...</div>
//               <div className="product-box-price">{p.price}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//         <div className="product-box">
//         {visable && products?.map((p) => (
//           <div key={p._id} className="product-box-card">
//             <div className="product-box-image-main">
//               <Link to={`/product/${p._id}`}><img className="product-box-image" src={p.image} alt={p.title.slice(0, 10)}/></Link>
//             </div>
//             <div className="product-box-text">
//               <div className="product-card-icon">
//                 <div className="product-icon-wishlist" onClick={() => {addToWishlist(p._id)}}><FaRegHeart/></div>
//                 <div className="product-icon-cart" onClick={() => {addToCart(p._id)}}><FaCartPlus/></div>
//               </div>
//               <div className="product-box-title">{p.title.slice(0, 15)}...</div>
//               <div className="product-box-price">{p.price}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//       </div>
//     </div>
//   )
// }

// export default Search



import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
// import "./Search.css";

const Search = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showShortlisted, setShowShortlisted] = useState(false);

  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("default");
  const [shortlist, setShortlist] = useState([]);
  const apiDomain = import.meta.env.VITE_API_URL;
  const params = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
      const {data} = await axios.post(`${apiDomain}/api/v1/product/search/${params.keyword}`)
        setProducts(data.products || []);
      } catch (err) {
        console.log(err);
        setError("Products load nahi ho paye.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params?.keyword]);

  const categories = useMemo(() => {
    const list = products
      .filter((p) => p.category)
      .map((p) => ({
        id: p.category._id || p.category,
        name: p.category.name || "Category",
      }));

    return [...new Map(list.map((c) => [c.id, c])).values()];
  }, [products]);

  const toggleShortlist = (id) => {
    setShortlist((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const resetFilters = () => {
    setCategory("all");
    setMaxPrice(10000);
    setMinRating(0);
    setSort("default");
    setShowShortlisted(false);
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const price = Number(p.price || 0);
      const rating = Number(p.rating || 0);
      const categoryId = p.category?._id || p.category;

      return (
        price <= maxPrice &&
        rating >= minRating &&
        (category === "all" || categoryId === category) &&
        (!showShortlisted || shortlist.includes(p._id))
      );
    });

    if (sort === "low") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sort === "high") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sort === "rating") {
      result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else if (sort === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [
    products,
    category,
    maxPrice,
    minRating,
    sort,
    shortlist,
    showShortlisted,
  ]);

  const FilterContent = () => (
    <>
      <div className="buygen-filter-section">
        <h4>Category</h4>

        <label>
          <input
            type="radio"
            checked={category === "all"}
            onChange={() => setCategory("all")}
          />
          All Categories
        </label>

        {categories.map((cat) => (
          <label key={cat.id}>
            <input
              type="radio"
              checked={category === cat.id}
              onChange={() => setCategory(cat.id)}
            />
            {cat.name}
          </label>
        ))}
      </div>

      <div className="buygen-filter-section">
        <div className="buygen-price-heading">
          <h4>Maximum Price</h4>
          <span>₹{maxPrice.toLocaleString("en-IN")}</span>
        </div>

        <input
          className="buygen-price-range"
          type="range"
          min="0"
          max="10000"
          step="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />

        <div className="buygen-price-labels">
          <span>₹0</span>
          <span>₹10,000+</span>
        </div>
      </div>

      <div className="buygen-filter-section">
        <h4>Customer Rating</h4>

        {[0, 3, 4].map((rating) => (
          <label key={rating}>
            <input
              type="radio"
              checked={minRating === rating}
              onChange={() => setMinRating(rating)}
            />
            {rating === 0 ? "All Ratings" : `${rating}★ & above`}
          </label>
        ))}
      </div>
    </>
  );

  return (
    <div className="buygen-search-page">
      <div className="buygen-search-heading">
        <div>
          <h1>Search Products</h1>
          <p>
            Results for <strong>"{search}"</strong>
          </p>
        </div>

        <button
          className={`buygen-shortlist-toggle ${
            showShortlisted ? "active" : ""
          }`}
          onClick={() => setShowShortlisted(!showShortlisted)}
        >
          ♥ Shortlist ({shortlist.length})
        </button>
      </div>

      <div className="buygen-search-layout">
        <aside className="buygen-filter-sidebar">
          <div className="buygen-filter-header">
            <h3>Filters</h3>
            <button onClick={resetFilters}>Reset</button>
          </div>
          <FilterContent />
        </aside>

        <main className="buygen-search-main">
          <div className="buygen-search-toolbar">
            <span>{filteredProducts.length} products</span>

            <div className="buygen-search-toolbar-actions">
              <button
                className="buygen-mobile-filter-btn"
                onClick={() => setShowFilters(true)}
              >
                ☷ Filters
              </button>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
              >
                <option value="default">Recommended</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="buygen-search-message">Loading products...</div>
          ) : error ? (
            <div className="buygen-search-message">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="buygen-search-empty">
              <span>⌕</span>
              <h3>No products found</h3>
              <p>Try another search or change your filters.</p>
              <button onClick={resetFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="buygen-search-grid">
              {filteredProducts.map((product) => (
                <article className="buygen-search-card" key={product._id}>
                  <button
                    className={`buygen-search-heart ${
                      shortlist.includes(product._id) ? "active" : ""
                    }`}
                    onClick={() => toggleShortlist(product._id)}
                    aria-label={
                      shortlist.includes(product._id)
                        ? "Remove from shortlist"
                        : "Add to shortlist"
                    }
                  >
                    {shortlist.includes(product._id) ? "♥" : "♡"}
                  </button>

                  <Link
                    to={`/product/${product._id}`}
                    className="buygen-search-product-link"
                  >
                    <div className="buygen-search-image-wrap">
                      <img
                        src={product.images?.[0]?.url || "/placeholder.png"}
                        alt={product.title}
                        loading="lazy"
                      />
                    </div>

                    <div className="buygen-search-product-info">
                      <h3>{product.title}</h3>

                      <div className="buygen-search-rating">
                        <span>★</span> {Number(product.rating || 0).toFixed(1)}
                      </div>

                      <div className="buygen-search-price">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {showFilters && (
        <div
          className="buygen-filter-overlay"
          onClick={() => setShowFilters(false)}
        >
          <section
            className="buygen-filter-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="buygen-drawer-heading">
              <h3>Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>

            <div className="buygen-drawer-content">
              <FilterContent />
            </div>

            <div className="buygen-drawer-actions">
              <button
                className="buygen-drawer-reset"
                onClick={resetFilters}
              >
                Reset
              </button>
              <button
                className="buygen-drawer-apply"
                onClick={() => setShowFilters(false)}
              >
                Show {filteredProducts.length} Products
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Search;
