import React, { useEffect, useState } from 'react';

// Import Styles
import imagesListStyle from './imageList.module.css';

// Import Component files
import AlbumsList from '../AlbumsList/AlbumsList';
import ImageForm from "../ImageForm/ImageForm";
import Carousel from "../carousel/Carousel";

// Import firestore database
import {db} from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';

const ImagesList = (props) => {
    // This imagesArray will have all the images of that particular album which is clicked.
    const[imagesArray, setImagesArray] = useState([]);
    
    // When image update button is clicked, that image will be assigned to this editobj.  
    const[editObj, setEditObj] = useState(null);

    // When image is clicked, carousel will open and that image will be assigned to this carouselImage.
    const[carouselImage, setCarouselImage] = useState(null);

    // This imageFormOpen will decide if ImageForm component would render on screen or imageForm should be open or close.
    const[imageFormOpen, setImageFOrmOpen] = useState(false);

    // If back-icon is clicked, AlbumsList page would render on screen, not ImagesList.
    const[backPage, setbackPage] = useState(false);

    // To refresh the page.
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        // Function to fetch the images from the database and update the state
        async function fetchImages() {
          const temp = doc(db, "albums", props.album.id);
          const albumSnapshot = await getDoc(temp);
          if (albumSnapshot.exists()) {
            setImagesArray(albumSnapshot.data().albumImages);
          }
        }
        fetchImages(); // Call the fetchImages function on component mount and whenever refresh changes
      }, [refresh]);


    // Go back to previous page
    function goBack(){
        setbackPage(!backPage);
    }

    function openCarousel(image){
    // Open this image in carousel
        setCarouselImage(image);
    }

    // Image form would be opened and closed.
    function openImageForm(){
        setImageFOrmOpen(!imageFormOpen);
    }

    // Atomically add a new object to the albumImages array.
    async function addImage(obj) {
        const temp = doc(db, "albums", props.album.id);
        
        await updateDoc(temp, {
            albumImages: arrayUnion(obj), 
        }); 
        
        setRefresh(!refresh);
        props.notification("Image added successfully");
    }

    // This function will delete image.
    async function deleteImage(obj){
        const temp = doc(db, "albums", props.album.id);
        await updateDoc(temp, {
            albumImages: arrayRemove(obj),    
        });
        setRefresh(!refresh);
        props.notification("Image deleted successfully");
    }

    // This function will set editObj variable to the image which update button is clicked.
    function editImage(image) {
        setEditObj(image);
        setImageFOrmOpen(true);
    }

    // This handleEdit function will update the image.
    async function handleEdit(toUpdateImg, toDeleteImg) {
        const temp = doc(db, "albums", props.album.id);
        await updateDoc(temp, {
            albumImages: arrayRemove(toDeleteImg),    
        });
        await updateDoc(temp, {
            albumImages: arrayUnion(toUpdateImg), 
        }); 
        setEditObj(null);
        openImageForm();
        setRefresh(!refresh);
    };

    return (
        <>

        {carouselImage===null? null:<Carousel 
                                    currentImage={carouselImage} 
                                    openCarousel={openCarousel} 
                                    images={imagesArray} 
                                    />}
            {backPage
            ?<AlbumsList/>
            :(
                  
                <div className={imagesListStyle.albumPage} style={carouselImage===null?{position:"relative"}:{position:"fixed"}}>
                    
                    {imageFormOpen
                            ?<ImageForm
                                    addImage={addImage} //This is function to add image.
                                    openImageForm={openImageForm} // This boolean value helps cancel icon to close form.
                                    handleEdit={handleEdit}  //This function will edit image.
                                    editObj={editObj} //This has image that needs to be edited or the image which is clicked to edit.
                                    /> 
                            : null
                    }

                    <img alt="go-back"
                        className={imagesListStyle.backIcon} 
                        onClick={goBack} src = "https://www.swimmeet.com/images/icons/go-back.png"
                    />
                    
                    {
                    props.album.albumImages.length === 0
                    ?(<><h1> No images in {props.album.albumName}.</h1>
                        <button className={imagesListStyle.addBtn} onClick={openImageForm}> {imageFormOpen?"Close Form":"Add image"} </button>
                        </>
                        )
                    :(
                        <>
                        <h1> Images in {props.album.albumName} </h1>

                        <button className={imagesListStyle.addBtn} onClick={openImageForm}> {imageFormOpen?"Close Form":"Add image"} </button>
                        <div className={imagesListStyle.cardBox}>
                            {imagesArray.map((image, index) => {
                                return( 
                                    <div key={index} className = {imagesListStyle.card}>
                                        <div className={imagesListStyle.icons}>
                                            <div className={imagesListStyle.deleteIcon} onClick={() => deleteImage(image)}>
                                                <i className="fa-solid fa-trash-can"></i>
                                            </div>
                                            <div className={imagesListStyle.editIcon} onClick={() => editImage(image)}>
                                                <i className="fa-solid fa-marker"></i>   
                                            </div>
                                        </div>
                                        <img src={image.imgSrc} className={imagesListStyle.cardImg} alt={image.imgName} onClick={() => openCarousel(image)}/>
                                        <b> {image.imgName}</b>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                    )}           
                </div>
            )}
        </>
    )
}

export default ImagesList;
