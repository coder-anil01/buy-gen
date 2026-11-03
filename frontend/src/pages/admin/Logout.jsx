import React from 'react'
import { useAuth } from '../../context/auth'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';
import AdminMenu from './AdminMenu';

const Logout = () => {

  const[auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleLogout = async()=>{
    try {
      setAuth({ ...auth, user: null, token: "", })
        await localStorage.removeItem('auth')
        toast.success("Logout Successfully")
        navigate('/login')
    } catch (error) {
      toast.error("Internal server Error")
    }
  }

  return (
    <>
    <SeoHelmet title="Admin Profile LogOut" description={`The "Admin Logout" function in an eCommerce platform serves as a vital security feature, allowing administrators or users with administrative privileges to securely terminate their active sessions and log out from the administrative backend or dashboard.`}/>
    <div className='dashbord'>
      <div className='dashbord-menu'><AdminMenu/></div>
      <div className='dashbord-content'>
      <div className='logout-btn' onClick={handleLogout}>Logout</div>
      </div>
    </div>
    </>
  )
}

export default Logout
