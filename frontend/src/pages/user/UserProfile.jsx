import React, { useState } from 'react'
import '../../style/Dashbord.css'
import UserMenu from './UserMenu'
import { useAuth } from '../../context/auth'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaUser,FaPhoneAlt, FaShippingFast } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { GiBrain } from "react-icons/gi";
import { GiPostOffice } from "react-icons/gi";
import { useLocation, useNavigate } from 'react-router-dom'
import SeoHelmet from '../../components/SeoHelmet'


const UserProfile = () => {
    const apiDomain = process.env.REACT_APP_API_URL;

  const[auth, setAuth] = useAuth();
  const user = auth?.user;
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location)
  const[ name, setName ] = useState(user?.name);
  const[ email, setEmail ] = useState(user?.email);
  const[ phone, setPhone ] = useState(user?.phone);
  const[ newAnswer, setNewAnswer ] = useState(user?.answer);
  const[ address, setAddress ] = useState(user?.address);
  const[ pin, setPin ] = useState(user?.pin);

  const handleRegister = async(e) => {
    e.preventDefault();
    try {
        const {data} = await axios.put(`${apiDomain}/api/v1/auth/updated/${user._id}`, {name, email, phone, answer: user.answer, address, pin, newAnswer})
        if(data.success){
            setAuth({ ...auth, user: data?.user, token: data?.token, })
            localStorage.setItem('auth', JSON.stringify(data))
            toast.success(data.message)
            if(location.state){
                navigate(location.state)
            }
        }else{
            toast.warn(data.message)
        }
    } catch (error) {
        toast.error("Internal Server Error")
    }
}

  return (
    <>
    <SeoHelmet title="Edit My Account" description="Welcome to the heart of personalization: the Account Edit section. Here, you wield the power to tailor your shopping experience to perfection. Update your personal details, manage shipping addresses, and fine-tune your preferences effortlessly. Whether it's tweaking your sizing options, updating your communication preferences, or refining your saved payment methods, this is your space for customization"/>
    <div className='dashbord'>
      <div className='dashbord-menu'><UserMenu/></div>
      <div className='dashbord-content'>
    
      <form className='login-form' onSubmit={handleRegister}>
      <h1 className='login-form-heading'>Update Account</h1>
      <label htmlFor="html">Name:-</label>
        <div className='login-form-items'>
            <div className='login-form-icon'><FaUser/></div>
            <input type="text"
            value={name}
            onChange={(e)=> setName(e.target.value)}
            placeholder='Enter Your Name'
            className='login-form-input'
            />
        </div>
        <label htmlFor="html">Email:-</label>
        <div className='login-form-items'>
            <div className='login-form-icon'><MdEmail/></div>
            <input type="email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            placeholder='Enter Your Email'
            className='login-form-input'
            />
        </div>
        <label htmlFor="html">Phone:-</label>
        <div className='login-form-items'>
            <div className='login-form-icon'><FaPhoneAlt/></div>
            <input type="Number"
            value={phone}
            onChange={(e)=> setPhone(e.target.value)}
            placeholder='Enter Mobile Number'
            className='login-form-input'
            />
        </div>
        <label htmlFor="html">Password Hint:-</label>
        <div className='login-form-items'>
            <div className='login-form-icon'><GiBrain/></div>
            <input type="text"
            value={newAnswer}
            onChange={(e)=> setNewAnswer(e.target.value)}
            placeholder='Enter Password Hint'
            className='login-form-input'
            />
        </div>
        <label htmlFor="html">Delivery Address:-</label>
        <div className='login-form-items'>
            <div className='login-form-icon'><FaShippingFast/></div>
            <input type="text"
            value={address}
            onChange={(e)=> setAddress(e.target.value)}
            placeholder='Enter Delivery Address'
            className='login-form-input'
            />
        </div>
        <label htmlFor="html">Address Pin Code:-</label>
        <div className='login-form-items'>
            <div className='login-form-icon'><GiPostOffice/></div>
            <input type="Number"
            value={pin}
            onChange={(e)=> setPin(e.target.value)}
            placeholder='Delivery Pin Code'
            className='login-form-input'
            />
        </div>
        
        <button type='submit' className='login-form-submit'>Update</button>
      </form>

      </div>
    </div>
    </>
  )
}

export default UserProfile
