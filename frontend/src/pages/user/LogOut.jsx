import React from 'react'
import UserMenu from './UserMenu'
import { useAuth } from '../../context/auth'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';

const LogOut = () => {
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
    <SeoHelmet title="Logout My Addount" description="Ready to step away for now? We understand! Logging out is as easy as it is secure. Simply click on the 'Logout' button to safely exit your personalized shopping haven. It's the perfect way to wrap up your session, ensuring your privacy and safeguarding your account. But remember, your shopping journey is just a click away whenever you're ready to return"/>
    <div className='dashbord'>
      <div className='dashbord-menu'><UserMenu/></div>
      <div className='dashbord-content'>
      <div className='logout-btn' onClick={handleLogout}>Logout</div>
      </div>
    </div>
    </>
  )
}

export default LogOut
