import React, { useEffect, useState } from "react";

// Import Component files
import imagesListStyle from "./imageList.module.css";
import AlbumsList from "../AlbumsList/AlbumsList";
import ImageForm from "../ImageForm/ImageForm";
import Carousel from "../carousel/Carousel";

// Import firebase
import { db } from "../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc} from "firebase/firestore";

// Import react-spinner-library
import Spinner from 'react-spinner-material';

const ImagesList = (props) => {
  // imagesArray have all the images of particular album.
  const [imagesArray, setImagesArray] = useState([]);

  // If image update button is clicked, details of that image will be assigned to this editObj.
  const [editObj, setEditObj] = useState(null);

  // If any image is clicked to see in a full view, details of that image will be assigned to this carouselImage.
  const [carouselImage, setCarouselImage] = useState(null);

  // This will decide if imageForm should be open or close.
  const [imageFormOpen, setImageFormOpen] = useState(false);

  // This will decide if app should go to back page.
  const [backPage, setbackPage] = useState(false);

  // To refresh the page.
  const [refresh, setRefresh] = useState(false);

  // To show loading icon
  const[loading, setLoading] = useState(true);

  // To get the data from database
  async function fetchImages() {
    const temp = doc(db, "albums", props.album.id);
    const albumSnapshot = await getDoc(temp);

    if (albumSnapshot.exists()) {
      setImagesArray(albumSnapshot.data().albumImages);
    }
    
  }

  useEffect(() => {
    fetchImages();
    setLoading(false);
  }, [refresh]);

  // To go back on the previous page.
  function goBack() {
    setbackPage(!backPage);
  }

  // To open image in carousel
  function openCarousel(image) {
    setCarouselImage(image);
  }

  // To open image form.
  function openImageForm() {
    setImageFormOpen(!imageFormOpen);
  }

  // To add image in database.
  async function addImage(obj) {
    setLoading(true);

    const temp = doc(db, "albums", props.album.id);
    await updateDoc(temp, {
      albumImages: arrayUnion(obj),
    });

    setRefresh(!refresh);
    setLoading(false);
    props.notification("Image added successfully");
  }

  // To delete image from database.
  async function deleteImage(obj) {
    setLoading(true);

    const temp = doc(db, "albums", props.album.id);
    await updateDoc(temp, {
      albumImages: arrayRemove(obj),
    });

    setRefresh(!refresh);
    setLoading(false);
    props.notification("Image deleted successfully");
  }

  // If image edit button is clicked, it will start edit process.
  function editImage(image) {
    setEditObj(image);
    setImageFormOpen(true);
  }

  // This function will edit image.
  async function handleEdit(toUpdateImg, toDeleteImg) {
    setLoading(true);
    const temp = doc(db, "albums", props.album.id);

    await updateDoc(temp, {
      albumImages: arrayRemove(toDeleteImg),
    });

    await updateDoc(temp, {
      albumImages: arrayUnion(toUpdateImg),
    });

    openImageForm();
    setEditObj(null);
    setRefresh(!refresh);
    setLoading(false);
    props.notification("Image updated successfully");
  }

  return (
    <>
    {loading===true
      ?<div className={imagesListStyle.spinnerStyle}> <Spinner radius={50} color={"orange"} stroke={5} visible={true} /></div>
      :
      <>
      {carouselImage === null ?null :<Carousel currentImage={carouselImage} openCarousel={openCarousel} images={imagesArray} />}

      {
        backPage 
        ? <AlbumsList /> 
        : (
          <div className={imagesListStyle.albumPage} style={carouselImage === null ? { position: "relative" }: { position: "fixed" }}>

          {imageFormOpen ?<ImageForm addImage={addImage} openImageForm={openImageForm} handleEdit={handleEdit} editObj={editObj}/> :null}

          <img alt="go-back" className={imagesListStyle.backIcon} onClick={goBack} src="https://www.swimmeet.com/images/icons/go-back.png"/>

          {imagesArray.length === 0 
          ? 
            <> 
            <h1> No images in {props.album.albumName}.</h1>
            <button className={imagesListStyle.addBtn} onClick={openImageForm} >{imageFormOpen ? "Close Form" : "Add image"} </button>
            </>
          : 
            <>
              <h1> Images in {props.album.albumName} </h1>
              <button className={imagesListStyle.addBtn} onClick={openImageForm}> {imageFormOpen ? "Close Form" : "Add image"} </button>
              
              <div className={imagesListStyle.cardBox}>
                {imagesArray.map((image, index) => (
              
                  <div key={index} className={imagesListStyle.card}>

                    <div className={imagesListStyle.icons}>
                      <div className={imagesListStyle.deleteIcon} onClick={() => deleteImage(image)}> <i className="fa-solid fa-trash-can"></i> </div>
                      <div className={imagesListStyle.editIcon} onClick={() => editImage(image)}> <i className="fa-solid fa-marker"></i> </div>
                    </div>

                    <img src={image.imgSrc} className={imagesListStyle.cardImg} alt={image.imgName} onClick={() => openCarousel(image)}/>
                    <b> {image.imgName}</b>

                  </div>

                ))}
              </div>

            </>
          }
        </div>
      )}
      </>
      }  
    </>
  );
};

export default ImagesList;

