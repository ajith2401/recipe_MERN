import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import RecipeForm from "./RecipeForm";
import PropTypes from 'prop-types';
 // Import your recipe creation form

const CreateRecipeForm = ({ open, close }) => {
  // ...

  // Function to close the form

  return (
    <Dialog open={open} close={close} fullWidth>
      <DialogContent>
      <RecipeForm open={open} close={close}/>{/* Replace with your actual form */}
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CreateRecipeForm.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default CreateRecipeForm;
