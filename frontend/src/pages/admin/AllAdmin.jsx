import React, { useEffect, useState } from 'react'
// import AdminMenu from './AdminSidebar'
import axios from 'axios';
import { IoIosMail } from "react-icons/io";
import { FaPhoneAlt,FaUser,  } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import SeoHelmet from '../../components/SeoHelmet';
import AdminMenu from './AdminMenu';



const AllAdmin = () => {
  const apiDomain = process.env.REACT_APP_API_URL;

  const [user, setUser] = useState([]);
  const[total, setTotal] = useState(0);
  const[id, setId] = useState("");
  const[name, setName] = useState("");
  const[email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  
  const getAllAdmin = async()=>{
    try {
      const {data} = await axios.get(`${apiDomain}/api/v1/auth/get-alladmin`)
      setUser(data.allAdmin)
      setTotal(data.countTotal)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteAdmin = async()=>{
    try {
      await axios.delete(`${apiDomain}/api/v1/auth/admin-delete/${id}`)
      setIsModalOpen(false);
      getAllAdmin();
    } catch (error) {
      toast.error("Internal Server Error")
    }
  }

  useEffect(()=>{
    getAllAdmin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <>
    <SeoHelmet title={`(${total}) Admin `} description="An admin order dashboard in an eCommerce platform is a central interface specifically designed for administrators or store owners to oversee and manage all aspects of incoming orders. It serves as a control center providing a comprehensive view of the order fulfillment process, enabling effective handling of customer purchases and streamlining operational workflows."/>
    <div className='dashbord'>
      <div className='dashbord-menu'><AdminMenu/></div>
      <div className=''>
        <div className='dashbord-menu-total'>All Admins:- {total}</div>
        <div className='dashbord-menu-box'>
          {user?.map((u)=>(
            <div className='dashbord-menu-box-card'>
              <div><FaUser/> {u.name}</div>
              <div><IoIosMail/> {u.email}</div>
              <div><FaPhoneAlt/> {u.phone}</div>
              <div className='dashbord-menu-box-card-delete' onClick={()=> {showModal(); setId(u._id); setName(u.name); setEmail(u.email)}} ><MdDelete/></div>
            </div>
          ))}
        </div>
        <Modal title="Delete Admin" open={isModalOpen} onOk={deleteAdmin} onCancel={handleCancel}>
        <h3>If you want to delete then click on "Ok"</h3>
        <p><strong>Name:- </strong>{name}</p>
        <p><strong>Email:- </strong>{email}</p>
      </Modal>
      </div>
    </div>
    </>
  )
}

export default AllAdmin
