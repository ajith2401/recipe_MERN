import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage,ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../firebase.js';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Box,   
    Typography,  
    Button,
    TextField,
    useMediaQuery,
  } from "@mui/material";
import FlexBetween from "../../components/FlexBetween.jsx";
import { deleteUserFailure, updateUserFailure, updateUserSuccess, deleteUserStart, deleteUserSuccess, updateUserStart } from "../../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import Navbar from "../NavBar/index.jsx";
// import LoadingIcon from "../../components/LoadingIcon.jsx";

const UpdateProfile = () => {
  const navigateTo = useNavigate()
  const dispatch = useDispatch();
  // const { palette } = useTheme();
  const {loading,currentUser} = useSelector((state) => state.user)
  const _id = currentUser._id
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    image: "",
    authorId:_id
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
    
    // const token = useSelector((state) => state.token);
    // const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    // const mediumMain = palette.neutral.mediumMain;
    // const medium = palette.neutral.medium;
    const [uploadFile,setUploadFile] = useState(undefined)
    const [uploadPercentage,setUploadPercentage] = useState(undefined)
    const [fileUploadError,setFileUploadError] = useState(false)
    useEffect(() => {
        if (uploadFile) {
            handleFileUpload(uploadFile);
            console.log("uploadFile",uploadFile)
        }
    }, [uploadFile]);

    const handleFileUpload = (file) => {
      if (file) {
          const storage = getStorage(app);
          const uploadFileName = new Date().getTime() + (file ? file.name : currentUser.firstName);
          const storageRef = ref(storage, uploadFileName);
          const uploadTask = uploadBytesResumable(storageRef, file);
        
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadPercentage(Math.round(progress));
            },
            (error) => {
              setFileUploadError(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setFormData({ ...formData, avatar: downloadURL });
                console.log("downloadURL",downloadURL)
              });
             
            }
          );
      
      }
      else{
          console.log("file is missing")
      }
  
   
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        dispatch(updateUserStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(updateUserFailure (data.message));
          setTimeout(() => dispatch(updateUserFailure(null)), 2000);
          return;
        }
        dispatch(updateUserSuccess (data));
        navigateTo('/');
      } catch (error) {
        dispatch(updateUserFailure(error.message));
        setTimeout(() => dispatch(updateUserFailure(null)), 2000);
      }
    }
    
    const handleDeleteAccount = async () =>  {
      try {
        dispatch(deleteUserStart())
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await res.json()
        if (data.success === false){
          dispatch(deleteUserFailure(data.message))
          setTimeout(() => dispatch(deleteUserFailure(null)), 2000);
          return
        }
        dispatch(deleteUserSuccess(data))
        navigateTo('/signin');
      } catch (error) {
        dispatch(deleteUserFailure(error.message)) 
        setTimeout(() => dispatch(deleteUserFailure(null)), 2000);
      }
  
    }
    const fileRef = useRef()
    const isNonMobile = useMediaQuery("(min-width:600px)");
  
    return (
      <Box>
      <Navbar />
      <form onSubmit={handleSubmit}> 
      <Box
        display="flex"
        flexDirection="column"
        gap="30px"
        sx={{
          margin: "2rem",
          justifyContent:"space-between",
          alignItems:"center"
        }}
      >
        <Typography variant="h5">Profile</Typography>
    
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <img src={formData.avatar || currentUser.avatar} onClick={() => fileRef.current.click()} id='profile_picture_2' alt='profilepicture' />
          {fileUploadError ? <p className='errorMsg'>{fileUploadError}</p> : uploadPercentage > 0 && uploadPercentage < 100 ? <p style={{ color: "slate", fontWeight: "bold" }}>uploading {uploadPercentage} %</p> : uploadPercentage === 100 ? <p style={{ color: "green", fontWeight: "bold" }}>file uploaded successfully..! </p> : " "}
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            hidden
            onChange={(e) => setUploadFile(e.target.files[0])}
          />
        </div>
    
        <TextField
          label="First Name"
          name="firstName"
          variant="outlined"
           fullWidth={isNonMobile ? true : false}
          sx={{ gridColumn: "span 2",width:"60vw" }}
          defaultValue={currentUser.firstName}
          onChange={handleChange}
        />
    
        <TextField
          name="lastName"
          label="Last Name"
          variant="outlined"
           fullWidth={isNonMobile ? true : false}
          sx={{ gridColumn: "span 2",width:"60vw" }}
          defaultValue={currentUser.lastName}
          onChange={handleChange}
        />
    
        <TextField
          label="Email"
          name="emailOrPhoneNumber"
          variant="outlined"
           fullWidth={isNonMobile ? true : false}
          sx={{ gridColumn: "span 2",width:"60vw" }}
          defaultValue={currentUser.emailOrPhoneNumber}
          onChange={handleChange}
        />
    
        <TextField
          name="location"
          label="location"
          variant="outlined"
           fullWidth={isNonMobile ? true : false}
          sx={{ gridColumn: "span 2",width:"60vw" }}
          defaultValue={formData.location}
          onChange={handleChange}
        />
    
        <TextField
          name="occupation"
          label="occupation"
          variant="outlined"
           fullWidth={isNonMobile ? true : false}
          sx={{ gridColumn: "span 2",width:"60vw" }}
          defaultValue={formData.occupation}
          onChange={handleChange}
        />

        <TextField
        label="twitter profile"
        name="twitter"
        variant="outlined"
        
        sx={{ gridColumn: "span 2",width:"60vw" }}
        defaultValue={currentUser.twitter}
        onChange={handleChange}
      />

      <TextField
      label="linkedIn profile"
      name="linkedIn"
      variant="outlined"
       fullWidth={isNonMobile ? true : false}
      sx={{ gridColumn: "span 2",width:"60vw" }}
      defaultValue={currentUser.linkedIn}
      onChange={handleChange}
    />
    
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          name="password"
           fullWidth={isNonMobile ? true : false}
          sx={{ gridColumn: "span 2",width:"60vw" }}
          // defaultValue={formData.instructions}
          onChange={handleChange}
        />
    
        <FlexBetween sx={{ gridColumn: "span 4" }}>
          <Button
            disable={loading}
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{
              margin: "4rem",
            }}
          >
            Update
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="secondary" // Use "secondary" for red color
            sx={{
              backgroundColor: 'red',
              margin: "2rem",
              '&:hover': {
                backgroundColor: 'darkred', // Define the background color when hovered
              }
            }}
          >
            Delete account
          </Button>
        </FlexBetween>
      </Box>
    
      </form>
   </Box>
    
    );
  };
  
  export default UpdateProfile;
  
