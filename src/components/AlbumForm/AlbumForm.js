// This component displays a form to create a new album in the database

import { useRef } from 'react';
import formStyle from './albumForm.module.css';

const AlbumForm = (props) => {
  const inputRef = useRef();

  // This function will clear form input.
  function clearInput(){
    inputRef.current.value = "";
  }

  // After clicking submit, this function will call props function which will add album to database.
  function handleSubmit(e){
    e.preventDefault();
    props.addAlbum(inputRef.current.value);
    clearInput();  
  }

  return (
    <div className={formStyle.albumForm}> 
      <h1> Create an album </h1>
      <form onSubmit={handleSubmit}>
        <input placeholder='Album Name' ref={inputRef} required/>
        <button className={formStyle.clearBtn} onClick={clearInput}> Clear </button>
        <button type="submit" className={formStyle.createBtn}> Create </button>
      </form>
    </div>
  )
}

export default AlbumForm;
