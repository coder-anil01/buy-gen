import React, { useEffect, useState } from 'react'
import '../../style/NavCartPage.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUser,FaPhoneAlt } from "react-icons/fa";
import { useAuth } from '../../context/auth';
import { FaTruckArrowRight } from "react-icons/fa6";
import SeoHelmet from '../../components/SeoHelmet';


const PaymentPage = () => {
  const apiDomain = process.env.REACT_APP_API_URL;

  const [auth] = useAuth();
  const [products, setProducts] = useState([])
  const navigate = useNavigate();

  const getCart = async()=>{
    try {
      const {data} = await axios.post(`${apiDomain}/api/v1/cart/get`, {user: auth?.user?._id})
      console.log(data.cart)
      setProducts(data.cart)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    if(auth?.token)getCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[auth])

  const totalPrice =()=> {
    try {
      let total = 0;
      products?.map((e)=>(
        total = total + e.product.price
      ));
      return total
    } catch (error) {
      console.log(error)
    }
  }

  const conformOrder =async()=> {
    try {
      const {data} = await axios.post(`${apiDomain}/api/v1/order/create`, {cart: products, id: auth?.user?._id, cartsId: products});
      if(data.success){
        cartDelete();
        toast.success(data.message);
      }else{
        toast.warn(data.message)
      }
    } catch (error) {
      toast.error("Internal Server Error")
    }
  }

  const cartDelete =async()=> {
    try {
      const {data} = await axios.delete(`${apiDomain}/api/v1/cart/alldelete/${auth?.user._id}`);
      if(data.success){
        navigate('/dashbord/order')
      }
    } catch (error) {
      toast.error("Internal Server Error")
    }
  }

  return (
    <>
    <SeoHelmet title="💸(COD) Order Product" description="Cash on Delivery,' a hassle-free way to complete your purchase. With this method, you can finalize your order by paying in cash upon the delivery of your chosen items. Enjoy the flexibility and peace of mind knowing that you can inspect your products before making the payment. It's a simple, reliable way to shop, ensuring your satisfaction every step of the way. Select 'Cash on Delivery' at checkout and indulge in a seamless shopping experience, where convenience meets trust."/>
    <div className='nav-cart'>
      <div className='nav-cart-left'>
        <div className='nav-cart-address'>
          <div>
            <div><FaUser/> <strong>Buyer:-</strong> {auth?.user?.name}</div>
            <div><FaPhoneAlt/> <strong>Phone:-</strong> {auth?.user?.phone}</div>
            <div><FaHome/> <strong>Address:-</strong> {auth?.user?.address}</div>
          </div>
          <Link to='/dashbord/profile' className='nav-cart-address-change'>Change</Link>
        </div>
        <div className='nav-cart-product'>
          <h2>Payment Method</h2>
          <h3>Cash On Delivery</h3>
        </div>
      </div>
      <div className='nav-cart-right'>
        <div>
          <h2>Price Details</h2>
          <h3>Total Price:- ₹ {totalPrice()}/-</h3>
        </div>
        <Link to="/dashbord/payment" onClick={conformOrder} className='nav-cart-place-order'>Conform Order <FaTruckArrowRight style={{fontSize:"22px"}}/></Link>
      </div>
    </div>
    </>
  )
}

export default PaymentPage
