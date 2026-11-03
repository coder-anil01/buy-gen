import '../style/Slider.css';
import React from 'react';
import { Carousel } from 'antd';

const Slider = () => {
  return (
    <div className='slider-container'>
        <Carousel className='slider-card' dots={false} autoplay={false} effect="fade">
            <img className='slider-card-div' src="https://picsum.photos/1000/300" alt="slider" />
            <img className='slider-card-div' src="https://picsum.photos/1000/301" alt="slider" />
            <img className='slider-card-div' src="https://picsum.photos/1001/300" alt="slider" />
            <img className='slider-card-div' src="https://picsum.photos/1001/301" alt="slider" />
        </Carousel>
    </div>
  )
}

export default Slider
