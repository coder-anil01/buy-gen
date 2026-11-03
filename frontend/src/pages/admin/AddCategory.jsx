import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../style/Categories.css";
import cloudinaryImagesUploads from "../../components/cloudinaryImagesUploads";
import axios from "axios";

const AddCategory = ({ CategoriesData }) => {
  const navigate = useNavigate();
  const apiDomain = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Category name is required");
      return;
    }
    if (!image) {
      alert("Category image is required");
      return;
    }
    try {
      setLoading(true);

      // Upload image to Cloudinary
      const cloudinaryImage = await cloudinaryImagesUploads(image);
      console.log("Cloudinary upload response:", cloudinaryImage); // Debugging log

      // Data sent to backend
      const categoryData = {
        name: formData.name.trim(),
        slug: formData.name
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
        description: formData.description.trim(),
        parent: formData.parent || null,
        image: cloudinaryImage[0].url,
        imagePublicId: cloudinaryImage[0].publicId,
      };
      const { data } = await axios.post(
        `${apiDomain}/api/v1/category/create`,
        categoryData,
      );
      if (!data.success) {
        throw new Error(data.message || "Category creation failed");
      }
      alert("Category added successfully");
      setFormData({
        name: "",
        description: "",
        parent: "",
      });

      setImage(null);
      setImagePreview("");

      navigate("/admin/categories");
    } catch (error) {
      console.error("Add category error:", error);

      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="add-category-content">
        {/* Heading */}
        <div className="add-category-heading">
          <div>
            <h1>Add Category</h1>
          </div>
        </div>

        {/* Form */}
        <form className="add-category-form" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="add-category-card">
            <div className="add-category-card-heading">
              <h2>Basic Information</h2>
              <p>Enter the basic information of your category.</p>
            </div>

            <div className="add-category-form-grid">
              {/* Category Name */}
              <div className="add-category-form-group full-width">
                <label htmlFor="name">
                  Category Name
                  <span className="required">*</span>
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  required
                />
              </div>

              {/* Description */}
              <div className="add-category-form-group full-width">
                <label htmlFor="description">Description</label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter category description"
                  rows="5"
                />
              </div>
            </div>
          </div>

          {/* Category Image */}
          <div className="add-category-card">
            <div className="add-category-card-heading">
              <h2>Category Image</h2>
              <p>Upload an image for this category.</p>
            </div>

            <div className="add-category-image-section">
              <label htmlFor="category-image">
                Category Image
                <span className="required">*</span>
              </label>

              <div className="add-category-image-upload">
                {imagePreview ? (
                  <div className="add-category-image-preview">
                    <img src={imagePreview} alt="Category preview" />

                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => {
                        setImage(null);
                        setImagePreview("");
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label htmlFor="category-image" className="image-upload-box">
                    <div className="upload-icon">+</div>
                    <h3>Upload Category Image</h3>
                    <p>Click to select an image</p>
                    <span>JPG, PNG or WEBP</span>
                  </label>
                )}

                <input
                  type="file"
                  id="category-image"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  required={!image}
                  hidden
                />
              </div>
            </div>
          </div>

          {/* Category Settings */}
          <div className="add-category-card">
            <div className="add-category-card-heading">
              <h2>Category Settings</h2>
              <p>Select the parent category if this is a sub-category.</p>
            </div>

            <div className="add-category-form-grid">
              {/* Parent Category */}
              <div className="add-category-form-group full-width">
                <label htmlFor="parent">Parent Category</label>

                <select
                  id="parent"
                  name="parent"
                  value={formData.parent}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {CategoriesData.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <small>Leave empty if this is a main category.</small>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="add-category-actions">
            <Link to="/admin/categories" className="cancel-category-btn">
              Cancel
            </Link>

            <button
              type="submit"
              className="save-category-btn"
              disabled={loading}
            >
              {loading ? "Uploading & Saving..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
