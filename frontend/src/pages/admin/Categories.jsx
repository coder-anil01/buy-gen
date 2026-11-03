// import React, { useEffect, useState } from 'react'
// import SeoHelmet from '../../components/SeoHelmet';
// import AdminMenu from './AdminSidebar';
// import axios from 'axios';
// import { Modal } from 'antd';
// import { toast } from 'react-toastify';
// import { MdDelete } from "react-icons/md";
// import { GrEdit } from "react-icons/gr";

// const Category = () => {
//   const apiDomain = process.env.REACT_APP_API_URL;

//   const [total, setTotal] = useState(0)
//   const [categories, setCategories] = useState([]);
//   const [name, setName] = useState("");
//   const [image, setImage] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const[ id, setId] = useState("");
//   const[updatedname, setUpdatedname] = useState("");
//   const[updatedimage, setUpdatedimage] = useState("");

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleOk = () => {
//     setIsModalOpen(false);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   const getAllCategory = async () => {
//     try {
//       const {data} = await axios.get(`${apiDomain}/api/v1/category/get`)
//       setCategories(data?.categories)
//       setTotal(data?.total)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(()=> {
//     getAllCategory()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   },[])

//   const handleSubmit = async(e)=>{
//     e.preventDefault();
//     try {
//       const {data} = await axios.post(`${apiDomain}/api/v1/category/create`, {name, image})
//       if(data.success){
//         setIsModalOpen(false)
//         toast.success(`${name} Created Successfully`)
//         getAllCategory();
//         setName("");
//         setImage("");
//       }else{
//         toast.info(data.message)
//       }
//     } catch (error) {
//       toast.warn("Internal Server Error")
//     }
//   }

//   const handleUpdate = async(e) => {
//     e.preventDefault();
//     try {
//       const {data} = await axios.put(`${apiDomain}/api/v1/category/update/${id}`, {name: updatedname, image: updatedimage})
//       if(data.success){
//         setIsModalOpen(false);
//         getAllCategory();
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const handleDelete = async(id) => {
//     try {
//       const {data} = await axios.delete(`${apiDomain}/api/v1/category/delete/${id}`)
//       if(data.success){
//         toast.info(data.message)
//         getAllCategory();
//       }
//     } catch (error) {
//       toast.error("Internal Server Error")
//     }
//   }
//   return (
//     <>
//     <SeoHelmet title={`(${total} ) Categories`} description=''/>
//     <div className='dashbord'>
//       <div className='dashbord-menu'><AdminMenu/></div>
//       <div className='dashbord-admin-product-contain'>
//       <h2 className='dashbord-form-heading'>Create Category</h2>
// {/* CREATE */}
//       <form className="form-group" onSubmit={handleSubmit}>
//         <div className='dashbord-admin-product'>
//           <input
//             type="text"
//             value={name}
//             onChange={(e)=> setName(e.target.value)}
//             className="form-control"
//             placeholder="Enter Title"
//             required
//           />
//           <input
//             type="text"
//             value={image}
//             onChange={(e)=> setImage(e.target.value)}
//             className="form-control"
//             placeholder="Enter Url"
//             required
//           />

//           </div>
//           <div className='dashbord-admin-product'>
//             <div className='dashbord-admin-product-card'>
//               {/* <img className='dashbord-admin-product-image' src={image} alt="Thumbnail" /> */}
//             </div>
//           </div>
//           <div className="form-submit"><button type="submit" >Submit</button></div>
//       </form>
//         <h2 className='dashbord-form-heading'>Total Category:- {total}</h2>
// {/* SHOW */}
//         <div className='manage-category-container'>
//           {categories?.map((c)=>(
//             <div className='manage-category-card'>
//               <div className='manage-category-crd-image-main'>
//                 <img className='manage-category-card-image' src={c.image} alt={c.name} />
//               </div>
//               <div className='manage-category-icon'>
//                 <button onClick={(e)=> {handleDelete(c._id)}} className='manage-category-icon-edit'><MdDelete/></button>
//                 <button onClick={() => {setId(c._id); setUpdatedimage(c.image); setUpdatedname(c.name); showModal()}} className='manage-category-icon-delete'><GrEdit/></button>
//               </div>
//               <div className='manage-category-card-name'>{c.name}</div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//     <Modal title="Manage Category" open={isModalOpen} onOk={handleOk} footer={null} onCancel={handleCancel}>
//     <form className="form-group" onSubmit={handleUpdate}>
//         <div className='dashbord-admin-product'>
//           <input
//             type="text"
//             value={updatedname}
//             onChange={(e)=> setUpdatedname(e.target.value)}
//             className="form-control"
//             placeholder="Enter Title"
//             required
//           />
//           <input
//             type="text"
//             value={updatedimage}
//             onChange={(e)=> setUpdatedimage(e.target.value)}
//             className="form-control"
//             placeholder="Enter Url"
//             required
//           />

//           </div>
//           <div className='dashbord-admin-product'>
//             <div className='dashbord-admin-product-card'>
//               {/* <img className='dashbord-admin-product-image' src={updatedname} alt="Thumbnail" /> */}
//             </div>
//           </div>
//           <div className="form-submit"><button type="submit" >Submit</button></div>
//       </form>
//     </Modal>

//     </>
//   )
// }

// export default Category



import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../style/Categories.css";
import AddCategory from "./AddCategory";
import axios from 'axios';
import AdminMenu from "./AdminMenu";

function Categories() {

  const apiDomain = import.meta.env.VITE_API_URL;

  const [status, setStatus] = useState("All");
  const [showCategory, setShowCategory] = useState(false);
  const [CategoriesData, setCategoriesData] = useState([]);


  useEffect(()=> {
    const getAllCategory = async () => {
    try {
      const {data} = await axios.get(`${apiDomain}/api/v1/category/get`);
      setCategoriesData(data.categories);
      console.log(data.categories);
    } catch (error) {
      console.log(error);
    }
  };

    getAllCategory();
  }, [apiDomain]);

  return (
    <>
      <AdminMenu />
      <div className="admin-dashbord-layout">
        {/* ================= CONTENT ================= */}
        <div className="categories-content">
          {/* Heading */}
          <div className="categories-heading">
            <div>
              <div className="categories-breadcrumb">
                <span>Dashboard</span>
                <b>/</b>
                <span>Categories</span>
              </div>
              <h1>Categories</h1>
              <p>Organize and manage your store product categories.</p>
            </div>
            <div
              onClick={() => setShowCategory(!showCategory)}
              className="add-product-btn"
            >
              {showCategory ? "Close Category Form" : "Add Category"}
            </div>
          </div>

          {/* ================= STATS ================= */}

          <section className="category-stats">
            <div className="category-stat-card">
              <div className="category-stat-icon blue">▦</div>

              <div>
                <span>Total Categories</span>

                <strong>{CategoriesData?.length}</strong>
              </div>
            </div>

            <div className="category-stat-card">
              <div className="category-stat-icon green">✓</div>

              <div>
                <span>Active Categories</span>

                <strong>7</strong>
              </div>
            </div>

            <div className="category-stat-card">
              <div className="category-stat-icon orange">📦</div>

              <div>
                <span>Total Products</span>

                <strong>265</strong>
              </div>
            </div>

            <div className="category-stat-card">
              <div className="category-stat-icon purple">☆</div>

              <div>
                <span>Featured</span>

                <strong>4</strong>
              </div>
            </div>
          </section>

          {/* category add form */}
          {showCategory && <AddCategory CategoriesData={CategoriesData}/>}

          {/* ================= CATEGORY CARD ================= */}

          <section className="categories-card">
            {/* Toolbar */}

            <div className="categories-toolbar">
              <div className="category-toolbar-left">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="categories-table-wrapper">
              <table className="categories-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Slug</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {/* Category */}
                  {CategoriesData.map((category) => (
                    <tr key={category._id}>
                      <td>
                        <div className="category-info">
                          <img src={category.image} alt={category.name} />
                          <div>
                            <strong>{category.name}</strong>
                            <span>{category.description}</span>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td>
                        <span className="category-slug">/{category.slug}</span>
                      </td>
                      {/* Products */}
                      <td>
                        <strong className="category-product-count">
                          {category.products}
                        </strong>
                      </td>

                      {/* Status */}

                      <td>
                        <span
                          // className={`category-status ${category.status.toLowerCase()}`}
                        >
                          <i />

                          {category.status}
                        </span>
                      </td>

                      {/* Actions */}

                      <td>
                        <div className="category-actions">
                          <Link
                            to={`/admin/categories/edit/${category.id}`}
                            title="Edit"
                          >
                            ✎
                          </Link>

                          <button title="Delete">🗑</button>

                          <button title="More">⋮</button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Empty */}

                  {CategoriesData.length === 0 && (
                    <tr>
                      <td colSpan="6" className="categories-empty">
                        <div>
                          <span>▦</span>
                          <strong>No categories found</strong>
                          <p>Try changing your search or status filter.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="categories-pagination">
              <span>
                Showing <strong>{CategoriesData.length}</strong> of{" "}
                <strong>{CategoriesData.length}</strong> categories
              </span>
              <div className="category-pagination-buttons">
                <button disabled>←</button>
                <button className="active">1</button>
                <button>2</button>
                <button>→</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Categories;
