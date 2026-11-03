// import React, { useState } from 'react'
// import "../style/Login.css"
// import { FaLock } from "react-icons/fa";
// import { MdEmail } from "react-icons/md";
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useAuth } from '../context/auth';
// import SeoHelmet from '../components/SeoHelmet';

// const Login = () => {
//   const apiDomain = process.env.REACT_APP_API_URL;
  
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [auth, setAuth] = useAuth();
//     const[ email, setEmail ] = useState("");
//     const[ password, setPassword ] = useState("");

//     const handleLogin = async(e) => {
//       e.preventDefault()
//       try {
//         const {data} = await axios.post(`${apiDomain}/api/v1/auth/login` ,{email, password})
//         if(data.success){
//           setAuth({ ...auth, user: data?.user, token: data?.token, })
//           localStorage.setItem('auth', JSON.stringify(data))
//           toast.success(data.message)
//           navigate(location.state ||'/')
//         }else{
//           toast.warn(data.message)
//         }
//       } catch (error) {
//           toast.error("Internal Server Error")
//       }
//     }

//   return (
//     <>
//     <SeoHelmet title="Login Page" description="The login page is the initial interface presented to users when accessing a protected application or platform. It acts as a checkpoint, requiring users to authenticate their identity before gaining access to the system's features"/>
//     <div className='login-form-body'>
//       <form className='login-form' onSubmit={handleLogin}>
//         <h1 className='login-form-heading'>Login Page</h1>
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
//             placeholder='Enter Your Password'
//             className='login-form-input'
//             required
//             />
//         </div>
//         <Link to="/forgot-password" className='login-form-link'>Forgot Password ?</Link>
//         <button type='submit' className='login-form-submit'>Login</button>
//         <div className='login-form-benidit'>I don't have an account <Link className='login-form-link' to='/register'>Create</Link></div>
//       </form>
//     </div>
//     </>
//   )
// }

// export default Login



import "../style/Login.css"
import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <SignIn
          routing="hash"
          signUpUrl="/register"
          afterSignInUrl="/"
        />
      </div>
    </div>
  );
};

export default Login;