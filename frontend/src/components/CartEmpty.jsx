import React from 'react';
import cart from '../image/Cart.png';
import {Link} from 'react-router-dom';

const CartEmpty = ({title}) => {
  return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "80vh"}}>
        <img style={{width: "90vw", maxWidth: "500px"}} src={cart} alt="Cart" />
        <div style={{fontSize: "20px"}}>{title}</div>
        <Link to='/' style={{marginTop: "20px"}} className='mid-button-p'>Contine Shoping</Link>
    </div>
  );
};

export default CartEmpty;
