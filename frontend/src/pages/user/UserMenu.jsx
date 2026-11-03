import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaEdit,FaCartPlus, FaHeart, FaCar, FaUser } from "react-icons/fa";
import { ImExit } from "react-icons/im";

const UserMenu = () => {
  return (
    <div className='menu'>
      <NavLink to="/dashbord" className="menu-button"><div className='menu-icon'><FaUser /></div> My Account</NavLink>
      <NavLink to="/dashbord/profile" className="menu-button"><div className='menu-icon'><FaEdit /></div> Edit Account</NavLink>
      <NavLink to="/dashbord/order" className="menu-button"><div className='menu-icon'><FaCar /></div> My Order</NavLink>
      <NavLink to="/dashbord/wishlist" className="menu-button"><div className='menu-icon'><FaHeart /></div> My Wishlist</NavLink>
      <NavLink to="/dashbord/cart" className="menu-button"><div className='menu-icon'><FaCartPlus /></div> My Cart</NavLink>
      <NavLink to="/dashbord/logout" className="menu-button"><div className='menu-icon'><ImExit /></div> Logout</NavLink>
    </div>
  )
}

export default UserMenu
