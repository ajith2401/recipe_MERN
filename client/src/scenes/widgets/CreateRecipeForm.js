import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import RecipeForm from "./RecipeForm"; // Import your recipe creation form

const CreateRecipeForm = ({ open, onClose }) => {
  // ...

  // Function to close the form

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create Recipe Post</DialogTitle>
      <DialogContent>
      <RecipeForm />{/* Replace with your actual form */}
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
