import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import RecipeForm from "./RecipeForm"; // Import your recipe creation form

const CreateRecipeForm = ({ open, close }) => {
  // ...

  // Function to close the form

  return (
    <Dialog open={open} close={onClose} fullWidth>
      <DialogContent>
      <RecipeForm open={open} close={onClose}/>{/* Replace with your actual form */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRecipeForm;
