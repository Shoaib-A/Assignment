"use client"
import React, { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { RiAddCircleLine } from "react-icons/ri";
import Dropzone from 'react-dropzone';
import { getProjects, addProject } from '../utils/firestore'; // Import the addProject function

import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { app, db, storage } from '../config/firebase';
import { getDownloadURL } from 'firebase/storage';






const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  

  const [cardDetailsModalOpen, setCardDetailsModalOpen] = useState(false);
  const [selectedCardDetails, setSelectedCardDetails] = useState(null);
  const [title, setTitle] = useState('');
const [owner, setOwner] = useState('Example Owner'); 
const [date, setDate] = useState(new Date());
const [uploadedImage, setUploadedImage] = useState(null);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleImageDrop = (acceptedFiles) => {
    const uploadedImage = acceptedFiles[0];
    setUploadedImage(uploadedImage);
  };
  const handleOwnerChange = (event) => {
    setOwner(event.target.value);
  };
  
  const handleDateChange = (event) => {
   
    const formattedDate = new Date(event.target.value).toISOString().split('T')[0];
    setDate(formattedDate);
  };
  
  
  
  const handleUploadImage = async () => {
    try {
     
      const storageRef = ref(storage, `images/${uploadedImage.name}`);
      await uploadBytes(storageRef, uploadedImage);
  
      
      const imageUrl = await getDownloadURL(storageRef);
  
     
      await addProject(title, date, owner, imageUrl);
  
     
      setTitle('');
      setOwner('Example Owner');
      setDate(new Date());
      setUploadedImage(null);
      handleCloseModal();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  
  
  
  

  const handleOpenCardDetailsModal = (selectedCard) => {
    setSelectedCardDetails(selectedCard);
    setCardDetailsModalOpen(true);
  };

  const handleCloseCardDetailsModal = () => {
    setCardDetailsModalOpen(false);
  };

  const formatDate = (date) => {
    try {
      if (date instanceof Date) {
        return date.toDateString();
      } else if (date?.toDate instanceof Function) {
        const jsDate = date.toDate();
        return jsDate.toDateString();
      } else {
        return 'Invalid Date';
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
   
    <div >
      
     <h1 >
        Added CheckedIn <RiAddCircleLine style={{ marginLeft: '74%', color: '#673ab7', cursor: 'pointer' }} onClick={handleOpenModal} />
      </h1>

      <Grid container spacing={2}>
        {projects.map((project) => (
          <Grid item key={project.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 10,
                borderRadius: 8,
                maxWidth: '80%',
                cursor: 'pointer',
              }}
              onClick={() => handleOpenCardDetailsModal(project)}
            >
              <CardMedia
                component="img"
                height="200"
                image={project.imageUrl}
                alt={project.title}
                sx={{ objectFit: 'cover', borderRadius: '4px' }}
              />
              <CardContent sx={{ flexGrow: 1, backgroundColor: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Typography variant="body2" color="black">
                    CheckedIn
                  </Typography>
                </div>
                <Typography variant="h6" component="div" color="black">
                  {project.title}
                </Typography>
                <Typography variant="body2" color="black">
                  Date: {formatDate(project.date)}
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar alt={project.owner} src="/static/images/avatar.jpg" />
                  <Typography variant="body2" color="black" sx={{ marginLeft: 1 }}>
                    Owner: {project.owner}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

     
      <Modal open={cardDetailsModalOpen} onClose={handleCloseCardDetailsModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Typography variant="h5">Card Details</Typography>
            <div style={{ cursor: 'pointer' }} onClick={handleCloseCardDetailsModal}>
              &#10006;
            </div>
          </div>
          {selectedCardDetails && (
            <>
              <CardMedia
                component="img"
                height="200"
                image={selectedCardDetails.imageUrl}
                alt={selectedCardDetails.title}
                sx={{ objectFit: 'cover', borderRadius: '4px', marginBottom: '16px' }}
              />
              <Typography variant="h6" component="div" color="black">
                {selectedCardDetails.title}
              </Typography>
              <Typography variant="body2" color="black">
                Date: {formatDate(selectedCardDetails.date)}
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar alt={selectedCardDetails.owner} src="/static/images/avatar.jpg" />
                <Typography variant="body2" color="black" sx={{ marginLeft: 1 }}>
                  Owner: {selectedCardDetails.owner}
                </Typography>
              </div>
            </>
          )}
        </div>
      </Modal>

     
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Typography variant="h5">Add CheckIn</Typography>
            <div style={{ cursor: 'pointer' }} onClick={handleCloseModal}>
              &#10006;
            </div>
          </div>
          <TextField
            label="Enter Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={handleTitleChange}
            style={{ marginBottom: '16px' }}
          />
          <TextField
  label="Owner"
  variant="outlined"
  fullWidth
  value={owner}
  onChange={handleOwnerChange}
  style={{ marginBottom: '16px' }}
/>

<TextField
  label="Date"
  variant="outlined"
  type="date"
  fullWidth
  value={date}
  onChange={handleDateChange}
  style={{ marginBottom: '16px' }}
/>

          <Dropzone onDrop={handleImageDrop}>
            {({ getRootProps, getInputProps }) => (
              <div style={{ border: '2px dashed #ccc', borderRadius: '4px', padding: '20px', textAlign: 'center', cursor: 'pointer', marginBottom: '16px' }} {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag & drop an image here, or click to select one</p>
              </div>
            )}
          </Dropzone>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleCloseModal} style={{ marginRight: '8px', padding: '8px 16px', backgroundColor: '#9e9e9e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleUploadImage} style={{ padding: '8px 16px', backgroundColor: '#673ab7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Add
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
