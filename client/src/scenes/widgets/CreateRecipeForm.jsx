import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import RecipeForm from "./RecipeForm"; // Import your recipe creation form

const CreateRecipeForm = ({ open, onClose }) => {
  // ...

  // Function to close the form

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogContent>
      <RecipeForm open={open} onClose={onClose}/>{/* Replace with your actual form */}
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
