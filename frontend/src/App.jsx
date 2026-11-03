import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";
import ProductDetails from "./pages/ProductDetails";
// import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgetPassword from "./pages/ForgetPassword";
import UserProfile from "./pages/user/UserProfile";
import UserRoute from "./routes/UserRoute";
import LogOut from "./pages/user/LogOut";
import Wishlist from "./pages/user/Wishlist";
import UserOrder from "./pages/user/UserOrder";
import UserCart from "./pages/user/UserCart";
import PaymentPage from "./pages/user/PaymentPage";
import AdminRoutes from "./routes/AdminRoutes";
import AdminDashbord from "./pages/admin/AdminDashbord";
import AdminProfile from "./pages/admin/AdminProfile";
import AllOrders from "./pages/admin/AllOrders";
import AllUsers from "./pages/admin/AllUsers";
import AllAdmin from "./pages/admin/AllAdmin";
import Category from "./pages/admin/Categories";
import Product from "./pages/admin/Product";
import Logout from "./pages/admin/Logout";
import Search from "./pages/Search";
import BuyNow from "./pages/user/BuyNow";
import ProductReviews from "./pages/ProductReviews";
import ScrollToTop from "./components/GoToTopButton";
import Checkout from "./pages/user/Checkout";
import CategoryProducts from "./pages/CategoryProduct";
import AdminReviews from "./pages/admin/AdminReviews";

function AppContent() {
  const location = useLocation();

  return (
    <>
    <ScrollToTop/>
      {/* Hide Navbar on admin pages */}
      {!location.pathname.startsWith("/admin") && <NavBar />}
      {/* <NavBar /> */}
      <ToastContainer
        autoClose={2000}
        transition={Flip}
        position="top-left"
      />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<UserCart />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/category/:id" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/buy/:id" element={<BuyNow />} />
        <Route path="/search/:keyword" element={<Search />} />
        <Route path="/review" element={<ProductReviews />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* USER ROUTES */}
        <Route path="/dashbord" element={<UserRoute />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="logout" element={<LogOut />} />
          <Route path="order" element={<UserOrder />} />
          {/* <Route path="cart" element={<UserCart />} /> */}
          <Route path="payment" element={<PaymentPage />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminRoutes />}>
          <Route index element={<AdminDashbord />} />
          <Route path="categories" element={<Category />} />
          <Route path="products" element={<Product />} />
          <Route path="orders" element={<AllOrders />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="customers" element={<AllUsers />} />
          <Route path="admins" element={<AllAdmin />} />
          <Route path="logout" element={<Logout />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>

      <div className="res-mob-buttom"></div>
      {/* {!location.pathname.startsWith("/admin") && <Footer />} */}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;