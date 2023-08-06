// Displays images in a model window as a carousel
import React, { useEffect, useState } from 'react';
import carouselStyle from './carousel.module.css';

const Carousel = (props) => {
  const[imageIndex, setImageIndex] = useState(0);

  let imagesArray = props.images;
  const index = props.images.indexOf(props.currentImage);
  
  useEffect(() =>
    setImageIndex(index)
  , [index])
  
  function goToPrevious(){
    if(imageIndex >= 1){
      setImageIndex(imageIndex-1);
    }
  }

  function goToNext(){
      if(imageIndex < imagesArray.length-1){
        setImageIndex(imageIndex+1);
    }
  }

  return (
    <div className={carouselStyle.container}>
      <div className={carouselStyle.leftArrow} onClick={goToPrevious}> <i className="fa-solid fa-angles-left"></i> </div>

      <div className={carouselStyle.imageStyle}> 
        <img src={imagesArray[imageIndex].imgSrc} alt={imagesArray[imageIndex].imgName}/>
      </div>
      
      <div className={carouselStyle.rightArrow} onClick={goToNext}> <i className="fa-solid fa-angles-right"></i> </div>
      <div className={carouselStyle.closeIcon} onClick={() => props.openCarousel(null)}>  <i className="fa-regular fa-circle-xmark"></i>  </div>
    </div>
  )
}

export default Carousel;
