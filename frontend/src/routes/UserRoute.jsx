// import '../style/UserRoutes.css'
import React from 'react'
import { useAuth } from '../context/auth';
import { Link, Outlet } from 'react-router-dom';

const UserRoute = () => {

  const [auth]= useAuth();

  return (
    <>
      {auth?.token ? <Outlet/> : <>
      <div className='user-routes'>
        <div className='user-routes-card'>
          <div className='user-routes-text'>I have an account</div>
          <Link className='user-routes-button' to='/login'>Login</Link>

          <div className='user-routes-text'>I don't have an account</div>
          <Link className='user-routes-button' to='/register'>Create</Link>
        </div>
      </div>
      </>}
    </>
  )
}

export default UserRoute
