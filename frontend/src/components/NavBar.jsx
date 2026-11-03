// import React from 'react'
// import {Link, NavLink} from 'react-router-dom'
// import Navlogo from '../image/navlogo.png'
// import { IoMdCart } from "react-icons/io";
// import { FaUser, FaRegHeart } from "react-icons/fa";
// import { FaShippingFast } from "react-icons/fa";
// import { useAuth } from '../context/auth';
// import { MdHome } from "react-icons/md";
// import SearchInput from './SearchInput';

// const NavBar = () => {

//   const[ auth ] = useAuth();

//   return (
//     <>
//     <div className='navbar'>
//       <Link to="/" className='navbar-logo-link'><img className='navbarlogo' src={Navlogo} alt="" /></Link>
//       <div><SearchInput/></div>
//       <div className='navbar-items'>
//         <NavLink className="res-icon-nav" to='/'><MdHome/></NavLink>
//         <NavLink to='/cart'><IoMdCart/></NavLink>
//         <NavLink to='/dashbord/wishlist'><FaRegHeart/></NavLink>
//         <NavLink className="res-icon-nav" to='/dashbord/order'><FaShippingFast/></NavLink>
//         <NavLink to={`/${auth?.user?.role === 8987 ? "admin" : "dashbord/profile"}`}><FaUser/></NavLink>
//       </div>
//     </div>
//     <div className='navbar-bottom-space'></div>
//     </>

//   )
// }

// export default NavBar

// import React from "react";
// import "../style/NavBar.css";
// import { useState } from "react";
// import "../style/NavBar.css";

// function NavBar() {
//   // const [cartCount, setCartCount] = useState(0);
//   const [cartCount] = useState(0);
//   // const [wishlist, setWishlist] = useState([]);
//   const [wishlist] = useState([]);
//   const [search, setSearch] = useState("");


//   return (
//     <>
//       <header className="navbar">
//         <div className="nav-container">
//           <a className="logo" href="/">
//             Gen<span>By</span>
//           </a>

//           <nav className="nav-links">
//             <a className="active" href="/">
//               Home
//             </a>

//             <a href="/shop">
//               Shop <span>⌄</span>
//             </a>

//             <a href="/categories">
//               Categories <span>⌄</span>
//             </a>

//             <a href="/deals">Deals</a>

//             <a href="/about">About</a>

//             <a href="/contact">Contact</a>
//           </nav>

//           <div className="nav-actions">
//             <div className="search-box">
//               <span>⌕</span>

//               <input
//                 type="text"
//                 placeholder="Search for products, brands..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>

//             <button className="nav-icon account">
//               ♙<span>Account</span>
//               <small>⌄</small>
//             </button>

//             <button className="nav-icon">
//               ♡{wishlist.length > 0 && <b>{wishlist.length}</b>}
//             </button>

//             <button className="nav-icon">
//               🛒
//               {cartCount > 0 && <b>{cartCount}</b>}
//             </button>
//           </div>
//         </div>
//       </header>
//     </>
//   );
// }

// export default NavBar;




import "../style/NavBar.css";
import { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import {
  FaBars,
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { useAuth } from "../context/auth";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOnly, setSearchOnly] = useState(false);
  const [auth] = useAuth();
  const location = useLocation().pathname;

  const cartCount = (auth?.cart || []).reduce((total, item) => total + Number(item.quantity || 1),0);


  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        if (window.innerWidth > 650 || currentScrollY < 80) {
          setSearchOnly(false);
        } else if (currentScrollY > lastScrollY + 5) {
          // Scroll down: show only search
          setSearchOnly(true);
        } else if (currentScrollY < lastScrollY - 5) {
          // Scroll up: show full navbar
          setSearchOnly(false);
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      window.location.href = `/search/${encodeURIComponent(search.trim())}`;
    }
  };

  return (
    <>
      <header
        className={`buygen-navbar ${
          searchOnly ? "search-only" : ""
        }`}
      >
        {/* Top bar */}
        <div className="buygen-topbar">
          <span>Best Deals | 7 Days Easy Returns | Top Brands </span>
          <span>🚚 Free Shipping on Orders Above ₹499</span>
          <span>24/7 Customer Support</span>
        </div>

        {/* Main bar */}
        <div className="buygen-mainbar">
          <button
            className="buygen-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <Link to="/" className="buygen-logo">
            Buy<span>gen</span>
          </Link>

          <form
            className="buygen-search"
            onSubmit={handleSearch}
          >
            <FaSearch className="buygen-search-icon" />

            <input
              type="search"
              placeholder="Search products, brands and more..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit">Search</button>
          </form>

          <div className="buygen-actions">
            <Link to="/login" className="buygen-action">
              <FaUser />
              <span>Account</span>
            </Link>

            <Link to="/wishlist" className="buygen-action">
              <FaHeart />
              <span>Wishlist</span>
            </Link>

            <Link to="/cart" className="buygen-action buygen-cart-icon">
              <FaShoppingCart />
              <span>Cart</span> 
              {cartCount > 0 && (<div className="buygen-cart-number">{cartCount}</div>)}
            </Link>
          </div>
        </div>

        {/* Category bar */}
        <nav className={`buygen-categorybar ${menuOpen ? "show" : ""}`}>
          {/* <Link
            to="/categories"
            className="buygen-all-categories"
            onClick={() => setMenuOpen(false)}
          >
            <FaBars />
            All Categories
            <FaChevronDown />
          </Link> */}

          {/* <div className="buygen-category-links">
            {categories.map((category, index) => (
              <Link key={category}
                to={ index === 0 ? "/" : `/category/${category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}`}
                className={index === 0 ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {category}

                {index !== 0 && index !== 4 && (
                  <FaChevronDown />
                )}
              </Link>
            ))}
          </div> */}
          <div className="buygen-category-links">
            <NavLink to="/" className={location == "/" && "active"} onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/dashbord/order" className={location == "dashbord/order" && "active"} onClick={() => setMenuOpen(false)}>Orders</NavLink>
            <NavLink to="/wishlist" className={location == "wishlist" && "active"} onClick={() => setMenuOpen(false)}>WishList</NavLink>
            <NavLink to="/category/6ac1307efdc50955f12dcb29" className={location == "category/6ac1307efdc50955f12dcb29" && "active"} onClick={() => setMenuOpen(false)}>Beauty & Personal Care</NavLink>
            <NavLink to="/category/men" className={location == "category/men" && "active"} onClick={() => setMenuOpen(false)}>Men</NavLink>
            <NavLink to="/category/women" className={location == "category/women" && "active"} onClick={() => setMenuOpen(false)}>Women</NavLink>
            <NavLink to="/category/Watch" className={location == "category/watch" && "active"} onClick={() => setMenuOpen(false)}>Watch</NavLink>

            {auth?.user?.role === "admin" &&
              <NavLink to="/admin" className={location == "admin" && "active"} onClick={() => setMenuOpen(false)}>Dashbord</NavLink>}

            {!auth?.user?._id &&
            <NavLink to="/register" className={location == "register" && "active"} onClick={() => setMenuOpen(false)}>Register</NavLink>}
            
          </div>
        </nav>
      </header>

      {/* Permanent space prevents page jumping */}
      <div className="buygen-navbar-space" />
    </>
  );
};

export default NavBar;
