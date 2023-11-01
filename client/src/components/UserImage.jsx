import { Box } from "@mui/material";
import PropTypes from 'prop-types';

const UserImage = ({ image, size ="60px" }) => {
return (
    <Box width={size} height={size}>
   <img style={{ 
    objectFit: "cover", 
    borderRadius: "50%"}}
    width={size}
    height={size}
    alt="user"
    src={image} />
</Box>
)} 

UserImage.propTypes = {
    image: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
  };
  
export default UserImage;