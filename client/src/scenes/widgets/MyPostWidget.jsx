import {
    Button,   
  } from "@mui/material";
  import CreateRecipeForm from "./CreateRecipeForm";
  import FlexBetween from "../../components/FlexBetween";
  import UserImage from "../../components/UserImage";
  import WidgetWrapper from "../../components/WidgetWrapper";
  import { useState } from "react";
  import {  useSelector } from "react-redux";
 
  
  const MyPostWidget = ({ picturePath }) => {
 
    const {loading} = useSelector((state) => state.user)
  
    const [isFormOpen, setIsFormOpen] = useState(false);

    const openForm = () => {
      setIsFormOpen(true);
    };
  
    const closeForm = () => {
      setIsFormOpen(false);
    };
  
    return (
      <WidgetWrapper>
        <FlexBetween gap="1.5rem">
          <UserImage image={picturePath} />
          <Button variant="contained" color="primary" onClick={openForm} disabled={loading}>
          Create Recipe Post
        </Button>
        <CreateRecipeForm open={isFormOpen} close={closeForm} />
        </FlexBetween>
      </WidgetWrapper>
    );
  };
  
  export default MyPostWidget;