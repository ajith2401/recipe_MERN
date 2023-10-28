import React, { useEffect, useState } from "react";
import { getDownloadURL, getStorage,ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../firebase.js';
import { useSelector } from "react-redux";
import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
  } from "@mui/icons-material";
  import Dropzone from "react-dropzone";
  import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    TextField,
    useMediaQuery,
  } from "@mui/material";
import FlexBetween from "../../components/FlexBetween.js";
import { setPosts,createPostFailure } from "../../redux/user/userSlice.js";
import { useDispatch } from "react-redux";

const RecipeForm = () => {
  

  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [post, setPost] = useState(false);
  const { palette } = useTheme();
  const {error,loading,currentUser} = useSelector((state) => state.user)
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
    setPost(true)
  };
    
    // const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;
    const resetForm = () => {
      setFormData({
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        image: "",
        authorId: _id,
      });
      setUploadFile(null); // Reset the uploaded file
      setPost(false); // Reset the post state
    };
    const [isFormOpen, setIsFormOpen] = useState(true);
    const [uploadFile,setUploadFile] = useState(undefined)
    const [uploadPercentage,setUploadPercentage] = useState(undefined)
    const [fileUploadError,setFileUploadError] = useState(false)
    useEffect(() => {
        if (uploadFile) {
            handleFileUpload(uploadFile);
            console.log("uploadFile",uploadFile)
        }
    }, [uploadFile]);
    const uploadedFileName = uploadFile ? uploadFile.name : '';
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
                const image = downloadURL;
                setFormData({ ...formData, image: image });
              });
             
            }
          );
      
      }
      else{
          console.log("file is missing")
      }
  
   
    };
    const handleSubmit = async () => {
     try {
      const response = await fetch(`https://ajith-recipe-app.onrender.com/api/posts/createpost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
       
      });
      const posts = await response.json();
      dispatch(setPosts({ posts }));
      setUploadFile(null);
      resetForm()
      setIsFormOpen(false);
     } catch (error) {
      dispatch(createPostFailure(error.message))
     }
    };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5">Create a Recipe Post</Typography>
      <TextField
        name="title"
        label="Title"
        variant="outlined"
        fullWidth
        value={formData.title}
        onChange={handleChange}
        required
        sx={{ marginTop: '1rem', padding: '1rem' }}
      />
      <TextField
        name="description"
        label="Description"
        variant="outlined"
        fullWidth
        value={formData.description}
        onChange={handleChange}
        sx={{ marginTop: '1rem', padding: '1rem' }}
      />
      <TextField
        name="ingredients"
        label="Ingredients"
        variant="outlined"
        fullWidth
        value={formData.ingredients}
        onChange={handleChange}
        required
        sx={{ marginTop: '1rem', padding: '1rem' }}
      />
      <TextField
        name="instructions"
        label="Instructions"
        variant="outlined"
        fullWidth
        value={formData.instructions}
        onChange={handleChange}
        required
        sx={{ marginTop: '1rem', padding: '1rem' }}
      />
      { isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}   
            onDrop={(acceptedFiles) => setUploadFile(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!uploadFile ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{uploadedFileName}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {uploadFile && (
                  <IconButton
                    onClick={() => setUploadFile(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image ajith
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <Button
          disabled={!post}
          onClick={handleSubmit}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </form>
  );
};

export default RecipeForm;
