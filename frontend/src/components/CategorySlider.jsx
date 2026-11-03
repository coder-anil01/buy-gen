import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CategorySlider = () => {
  const apiDomain = process.env.REACT_APP_API_URL;

    const settings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 7,
        slidesToScroll: 2,
        initialSlide: 0,
        // autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              dots: false,
              slidesToShow: 4,
              slidesToScroll: 1,
            },
          },
        ],
      };

    const [category, setCategory] = useState([]);

    // All Category
  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${apiDomain}/api/v1/category/get`);
      if (data.success) {
        setCategory(data.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

    useEffect(()=>{
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
  return (
    <>
      <div className="home-page-slick">
        <div className="homepage-category">
          <Slider {...settings}>
            {category?.map((c) => (
              <div key={c._id} className="h-c-card">
                <Link to={`/category/${c._id}`}>
                  <img className="h-c-image" src={c.image} alt={c.name} />
                </Link>
                <div className="h-c-name">{c.name}</div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  )
}

export default CategorySlider
