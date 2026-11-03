import { useEffect, useState } from 'react'
import '../style/NavCartPage.css'
import { useAuth } from '../context/auth'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import { FaHome, FaUser,FaPhoneAlt } from "react-icons/fa";
import SeoHelmet from '../components/SeoHelmet';
import CartEmpty from '../components/CartEmpty';




const NavCartPage = () => {
  const apiDomain = import.meta.env.VITE_API_URL;

  const [auth] = useAuth();
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0);

  const getCart = async()=>{
    try {
      const {data} = await axios.post(`${apiDomain}/api/v1/cart/get`, {user: auth?.user?._id})
      setProducts(data.cart)
      setTotal(data.total)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    if(auth?.token)getCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[auth])

  const deletCartProduct = async(id)=> {
    try {
      const {data} =await axios.delete(`${apiDomain}/api/v1/cart/delete/${id}`)
      toast.success(data.message)
      getCart();
    } catch (error) {
      toast.info("Internal Server error")
    }
  }

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

  return (
    <>
    <SeoHelmet title={total > 0 ? `(${total}) Items In Your Cart`: "Cart Page Is Empty"} description="Welcome to your shopping cart - the place where your dreams and selections come together! Here, you'll find all the fantastic items you've chosen in one convenient spot"/>
    { total > 0 ? <>
      <div className='nav-cart'>
      <div className='nav-cart-left'>
        <div className='nav-cart-address'>
          <div>
            <div><FaUser/> {auth?.user?.name}</div>
            <div><FaPhoneAlt/> {auth?.user?.phone}</div>
            <div><FaHome/> {auth?.user?.address}</div>
          </div>
          <Link to='/dashbord/profile' className='mid-button-p'>Edit</Link>
        </div>
        <div className='nav-cart-product'>
          {products?.map(item => (
            <div className='nav-cart-product-card' key={item.product._id}>
              <div className='nav-cart-product-card-left'>
                <Link to={`/product/${item.product._id}`}><img className='nav-cart-product-image' src={item.product.image} alt="" /></Link>
                <div className='nav-cart-product-text'>
                  <div className='nav-cart-product-title'>{item.product.title.slice(0,20)}...</div>
                  <div className='nav-cart-product-price'>₹ {item.product.price}/-</div>
                </div>
              </div>
              <button className='nav-cart-product-remove' onClick={()=>{deletCartProduct(item._id)}}>Remove</button>
            </div>
          ))}
        </div>
      </div>
      <div style={{height: "240px"}} className='payment-buy-right'>
        <div className='payment-buy-price-heading'>Payment-details</div>
        <div className='payment-buy-line'/>
        <div className='payment-buy-item'>
          <div>{total} item</div>
          <div>{totalPrice()}</div>
        </div>
        <div className='payment-buy-item'>
          <div>Delivery Charges</div>
          <div className='payment-buy-delivery-free'>FREE</div>
        </div>
        <div className='payment-buy-line'/>
        <div className='payment-buy-item-total-price'>
          <div>Total Payable:- </div>
          <div>₹{totalPrice()}</div>
        </div>
         <Link to="/dashbord/payment" className='nav-cart-place-order'>Place Order</Link>
      </div>

        
    </div>
    </> : <><CartEmpty title={"Your Cart Is Empty"}/></>}
    
    </>
  )
}

export default NavCartPage
