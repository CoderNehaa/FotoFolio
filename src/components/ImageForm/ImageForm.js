import React, { useRef, useEffect } from 'react';
import formStyle from './imageForm.module.css';

const ImageForm = (props) => {
  let titleRef = useRef();
  let linkRef = useRef();

  // Use the useEffect hook to populate the form fields when editObj is provided
  useEffect(() => {
    if (props.editObj) {
      titleRef.current.value = props.editObj.imgName;
      linkRef.current.value = props.editObj.imgSrc;
    }
  }, [props.editObj]);


  function clearInput(){
    titleRef.current.value="";
    linkRef.current.value="";
  }

  function handleSubmit(e) {
    e.preventDefault();
    if(props.editObj===null){
      // Add new Image
      const obj = {
        imgName: titleRef.current.value,
        imgSrc: linkRef.current.value,
      };

      props.addImage(obj);

    } else {
      // Update Image
      const toUpdateImg = {
        imgName: titleRef.current.value,
        imgSrc: linkRef.current.value,
      };
      props.handleEdit(toUpdateImg, props.editObj);
    }
    
    clearInput();
    titleRef.current.focus();
  }
    
  return (
    <div className={formStyle.imageForm}>
      <img alt="close-form"
        src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8fWTq8orzxS0rVTeWmP8hAK5MJG-K28p-6A&usqp=CAU' 
        onClick={props.openImageForm}
        />
      
      <h1> Add an image to this album </h1>
      
      <form onSubmit={handleSubmit}>
        <input placeholder='Title' ref={titleRef} required/>
        <input placeholder='Image URL' ref={linkRef} required/>
        <button className={formStyle.clearBtn} onClick={clearInput}> Clear </button>
        <button type="submit" className={formStyle.createBtn}> {props.editObj===null?"Add":"Update"} </button>
      </form>
    </div>
  )
}

export default ImageForm;
