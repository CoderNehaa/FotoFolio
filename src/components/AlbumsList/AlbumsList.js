// Import styles
import pageStyle from './albumsList.module.css';

// Import react hooks
import React, { useState, useEffect } from 'react';

// Import firestore database
import {db} from '../firebase';
import { doc, collection, addDoc, onSnapshot, deleteDoc } from "firebase/firestore";

// Import components
import AlbumForm from '../AlbumForm/AlbumForm';
import ImagesList from '../ImagesList/ImagesList';

// Import react-toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import react-spinner-library
import Spinner from 'react-spinner-material';

const AlbumsList = () => {
  const [loading, setLoading] = useState(true);

  // This albums array will have list of all the albums
  const [albums, setAlbums] = useState([]);

  // This selected album will be album which is clicked and now its images will be shown.
  const[selectedAlbum, setSelectedAlbum] = useState(null);
 
  // This button will open and close album form, when clicked.
  const [addBtn, setAddBtn] = useState(false);
  function handleAddBtn(){
    setAddBtn(!addBtn);
  }

  // This function will give notification toast
  function notification(text){
    toast.success(text,{
      autoClose: 3000,
    });
  }

  
  useEffect(() => {
    // Get data from firestore with real-time updates
    const unsub = onSnapshot(collection(db, "albums"), (snapShot) => {
      const albumsDb = snapShot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })
      setAlbums(albumsDb);
      setLoading(false);
    });
  }, [albums])
    
  // Add a new document to database with auto - generated id.
  async function addAlbum(albumName){
    setLoading(true);
    const docRef = await addDoc(collection(db, "albums"), {
      albumName: albumName,
      albumImages: []
    });
    setAlbums([docRef, ...albums]);
    setLoading(false);
    notification("Album added successfully !");
  }

  // Deleting album from database
  async function deleteAlbum(name, id){
    setLoading(true);
    await deleteDoc(doc(db, "albums", id));

    setLoading(false);
    notification("Album deleted successfully !");
  }

  // Conditionally render ImagesList inside of the AlbumsList component if an album is selected.
  function handleAlbumClick(album){
    setSelectedAlbum(album);
  }

  return (
    <>
    {loading
      ?<div className={pageStyle.spinnerStyle}>< Spinner radius={100} color={"orange"} stroke={7} visible={true} /></div>
      :selectedAlbum ?(<ImagesList album={selectedAlbum} notification={notification}/>)
                      :(
                        <div className={pageStyle.albumsPage}>
                            {addBtn?<AlbumForm addAlbum={addAlbum} handleAddBtn={handleAddBtn}/>:null}
                            
                            <div className={pageStyle.heading}>
                              <h1> Your albums </h1>
                              <button className={pageStyle.addBtn} onClick={handleAddBtn}> {addBtn?"Close Form":"Add album"} </button>
                            </div>
                            
                            <div className={pageStyle.albumsList}>
                              {albums.map((album, index) => {
                                return (
                                  <div className={pageStyle.albumCard} key={index}>

                                    {/* This below div will have delete icon which will show this icon on every album card. */}
                                    <div 
                                      className={pageStyle.deleteIcon} 
                                      onClick={() => deleteAlbum(album.albumName, album.id)}> 
                                      <i className="fa-solid fa-trash-can"></i>
                                    </div>

                                      <div className={pageStyle.album} key={index}>
                                        <img alt="album"
                                        src={
                                          album.albumImages && album.albumImages.length === 0
                                            ? "https://www.freeiconspng.com/thumbs/photography-icon-png/photo-album-icon-png-14.png"
                                            : album.albumImages && album.albumImages.length > 0
                                            ? album.albumImages[0].imgSrc
                                            : "https://www.freeiconspng.com/thumbs/photography-icon-png/photo-album-icon-png-14.png"
                                          }
                                          onClick={() =>handleAlbumClick(album)} 
                                        />
                                        <div className={pageStyle.albumName}> {album.albumName} </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          
                        </div>
                        )
      }
      <ToastContainer/>
    </>
  )
}

export default AlbumsList;
