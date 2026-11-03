import React, { useState } from 'react'
import { useAuth } from '../../context/auth';
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaUser,FaPhoneAlt, FaShippingFast } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { GiBrain } from "react-icons/gi";
import { GiPostOffice } from "react-icons/gi";
import SeoHelmet from '../../components/SeoHelmet';

const AdminProfile = () => {
    const apiDomain = import.meta.env.VITE_API_URL;

  const[auth, setAuth] = useAuth();
  const user = auth?.user;
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
        }else{
            toast.warn(data.message)
        }
    } catch (error) {
        toast.error("Internal Server Error");
        console.error;
    }
}

  return (
    <>
    <SeoHelmet title="Admin Prodile Edit" description="An admin profile editor in an eCommerce setting refers to the functionality within the system that allows administrators or store owners to edit and manage their personal or team profiles. It serves as a central tool for maintaining accurate and updated information about the individuals who have access to the administrative functions of the eCommerce platform."/>
    <div className='dashbord'>
      {/* <div className='dashbord-menu'><AdminMenu/></div> */}
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

export default AdminProfile
