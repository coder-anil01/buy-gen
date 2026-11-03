// import React, { useState } from 'react'
// import {Link, useLocation, useNavigate} from 'react-router-dom';
// import axios from 'axios';
// import { FaLock, FaUser,FaPhoneAlt, FaShippingFast } from "react-icons/fa";
// import { MdEmail } from "react-icons/md";
// import { GiBrain } from "react-icons/gi";
// import { toast } from 'react-toastify';
// import { GiPostOffice } from "react-icons/gi";
// import { useAuth } from '../context/auth';
// import SeoHelmet from '../components/SeoHelmet';

// const Register = () => {

// const apiDomain = import.meta.env.VITE_API_URL;

//     const navigate = useNavigate();
//     const location = useLocation();
//     const [auth, setAuth] = useAuth();
//     const[ name, setName ] = useState("");
//     const[ email, setEmail ] = useState("");
//     const[ password, setPassword ] = useState("");
//     const[ phone, setPhone ] = useState("");
//     const[ answer, setAnswer ] = useState("");
//     const[ address, setAddress ] = useState("");
//     const[ pin, setPin ] = useState("");

//     const handleRegister = async(e) => {
//         e.preventDefault();
//         try {
//             const {data} = await axios.post(`${apiDomain}/api/v1/auth/register`, {name, email, password, phone, answer,address, pin})
//             if(data.success){
//                 setAuth({ ...auth, user: data?.user, token: data?.token, })
//                 localStorage.setItem('auth', JSON.stringify(data))
//                 navigate( location.state || '/')
//                 toast.success(data.message)
//             }else{
//                 toast.warn(data.message)
//             }
//         } catch (error) {
//             toast.error("Internal Server Error")
//         }
//     }

//   return (
//     <>
//     <SeoHelmet title="Create Account" description="Welcome to our registration page! Join our vibrant community by creating your personal account. Registering with us opens the door to a world of possibilities. Whether you're here to shop, connect, or explore, signing up is your gateway to exclusive offers, personalized recommendations, and seamless access to our services. It's quick, easy, and free! Simply fill in your details to get started on your journey with us. Your adventure awaits!"/>
//     <div className='login-form-body'>
//       <form className='login-form' onSubmit={handleRegister}>
//       <h1 className='login-form-heading'>Create Account</h1>
//         <div className='login-form-items'>
//             <div className='login-form-icon'><FaUser/></div>
//             <input type="text"
//             value={name}
//             onChange={(e)=> setName(e.target.value)}
//             placeholder='Enter Your Name'
//             className='login-form-input'
//             required
//             />
//         </div>
//         <div className='login-form-items'>
//             <div className='login-form-icon'><MdEmail/></div>
//             <input type="email"
//             value={email}
//             onChange={(e)=> setEmail(e.target.value)}
//             placeholder='Enter Your Email'
//             className='login-form-input'
//             required
//             />
//         </div>

//         <div className='login-form-items'>
//             <div className='login-form-icon'><FaLock/></div>
//             <input type="password"
//             value={password}
//             onChange={(e)=> setPassword(e.target.value)}
//             placeholder='Enter New Password'
//             className='login-form-input'
//             required
//             />
//         </div>

//         <div className='login-form-items'>
//             <div className='login-form-icon'><FaPhoneAlt/></div>
//             <input type="Number"
//             value={phone}
//             onChange={(e)=> setPhone(e.target.value)}
//             placeholder='Enter Mobile Number'
//             className='login-form-input'
//             required
//             />
//         </div>

//         <div className='login-form-items'>
//             <div className='login-form-icon'><GiBrain/></div>
//             <input type="text"
//             value={answer}
//             onChange={(e)=> setAnswer(e.target.value)}
//             placeholder='Enter Password Hint'
//             className='login-form-input'
//             required
//             />
//         </div>

//         <div className='login-form-items'>
//             <div className='login-form-icon'><FaShippingFast/></div>
//             <input type="text"
//             value={address}
//             onChange={(e)=> setAddress(e.target.value)}
//             placeholder='Enter Delivery Address'
//             className='login-form-input'
//             required
//             />
//         </div>

//         <div className='login-form-items'>
//             <div className='login-form-icon'><GiPostOffice/></div>
//             <input type="Number"
//             value={pin}
//             onChange={(e)=> setPin(e.target.value)}
//             placeholder='Delivery Pin Code'
//             className='login-form-input'
//             required
//             />
//         </div>

//         <button type='submit' className='login-form-submit'>Register</button>
//         <div className='login-form-benidit'>I have an account <Link className='login-form-link' to='/login'>Login</Link></div>
//       </form>
//     </div>
//     </>
//   )
// }

// export default Register

// import { SignUp } from "@clerk/clerk-react";
// import { useLocation } from "react-router-dom";
// import "../style/Login.css";

// const Register = () => {
//   const location = useLocation();

//   const redirectUrl = location.state?.from || "/";

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <SignUp
//           routing="hash"
//           signInUrl="/login"
//           forceRedirectUrl={redirectUrl}
//         />
//       </div>
//     </div>
//   );
// };

// export default Register;

// import { SignUp } from "@clerk/clerk-react";
// import { useLocation } from "react-router-dom";
// import "../style/Login.css";

// const Register = () => {
//   const location = useLocation();

//   const checkoutData = location.state?.checkoutData;

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <SignUp
//           routing="hash"
//           signInUrl="/login"
//           forceRedirectUrl={
//             checkoutData
//               ? `/checkout?productId=${encodeURIComponent(checkoutData.productId)}&quantity=${encodeURIComponent(checkoutData.quantity)}`
//               : "/"
//           }
//         />
//       </div>
//     </div>
//   );
// };

// export default Register;

import { useState } from "react";
import axios from "axios";
import "../style/Register.css";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

const apiDomain = import.meta.env.VITE_API_URL;

const Register = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("register");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [auth, setAuth] = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccess("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  // Register API
  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError("Password does not match!");
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await axios.post(`${apiDomain}/api/v1/auth/register`, {
        email: formData.email,
        password: formData.password,
      });
      setSuccess(data.message);
      if (data.success) {
        setAuth({ ...auth, user: data?.user, token: data?.token });
        localStorage.setItem("auth", JSON.stringify(data));
        navigate(location.state || "/");
      }

      // switchTab("login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  // Login API
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const { data } = await axios.post(`${apiDomain}/api/v1/auth/login`, {
        email: formData.email,
        password: formData.password,
      });
      setSuccess(data.message);
      if (data.success) {
        setAuth({ ...auth, user: data?.user, token: data?.token });
        localStorage.setItem("auth", JSON.stringify(data));

        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        {/* Left Banner */}
        <div className="auth-banner">
          <div className="auth-brand">
            <span className="brand-icon">B</span>
            BUYGEN
          </div>

          <div className="banner-content">
            <span className="banner-tag">YOUR STYLE, YOUR CHOICE</span>

            <h1>
              Discover
              <br />
              Something
              <br />
              <span>New Everyday.</span>
            </h1>

            <p>
              Explore the latest trends and find products that match your
              lifestyle.
            </p>
          </div>

          <div className="banner-footer">
            <span>© 2026 BUYGEN</span>
            <span>Shop smarter. Live better.</span>
          </div>
        </div>

        {/* Right Auth Section */}
        <div className="auth-content">
          <div className="auth-box">
            <div className="auth-heading">
              <h2>
                {activeTab === "login" ? "Welcome back!" : "Create an account"}
              </h2>

              <p>
                {activeTab === "login"
                  ? "Enter your details to access your account."
                  : "Join us and start shopping today."}
              </p>
            </div>

            {/* Login / Register Tabs */}
            <div className="auth-tabs">
              <button
                type="button"
                className={activeTab === "login" ? "active" : ""}
                onClick={() => switchTab("login")}
              >
                Login
              </button>

              <button
                type="button"
                className={activeTab === "register" ? "active" : ""}
                onClick={() => switchTab("register")}
              >
                Register
              </button>
            </div>

            {/* Messages */}
            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <form
              onSubmit={activeTab === "login" ? handleLogin : handleRegister}
              className="auth-form"
            >
              {/* Email */}
              <div className="form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="password-label">
                  <label>Password</label>

                  {activeTab === "login" && (
                    <button
                      type="button"
                      className="forgot-link"
                      onClick={() =>
                        setSuccess(
                          "Forgot password feature will be connected soon.",
                        )
                      }
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              {activeTab === "register" && (
                <div className="form-group">
                  <label>Confirm Password</label>

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength={8}
                    required
                  />
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : activeTab === "login"
                    ? "Login to Account"
                    : "Create Account"}

                {!loading && <span>→</span>}
              </button>
            </form>

            <div className="auth-bottom">
              {activeTab === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={() =>
                  switchTab(activeTab === "login" ? "register" : "login")
                }
              >
                {activeTab === "login" ? "Register" : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
