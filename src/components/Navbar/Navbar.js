import React from 'react';

// Module CSS file implicitly exports an object
import navStyle from './navbar.module.css'

const Navbar = () => {
  return (
    <div className={navStyle.navbar}>
        <img src= "https://ealbum.in/wp-content/uploads/2019/07/ealbum-logo-black.png" alt="logo"/>
        <div className={navStyle.heading}>
          <span> FoToFoLio </span> 
          <p>  Your favorite place to store memories </p>
        </div>
    </div>
  )
}

export default Navbar;
