import { Box,Typography,useTheme,useMediaQuery } from '@mui/material';
import Form from "./Form"

const LoginPage = () => {
    const theme = useTheme()
    const isNonMobileScreens = useMediaQuery("(min-width : 1000px)")
  return (
    <Box width="100%"
    height={"100vh"}
    backgroundColor={theme.palette.background.alt}
    p= "1rem 6%"
    textAlign="center">
    <Box>
    <Typography fontWeight="bold" fontSize="32px" color="primary">
    Recipe Sharing </Typography>
    </Box>

    <Box
        width={isNonMobileScreens ? "50%" : "93%"} p="2rem" m="2rem auto" borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt} >       
        <Form />
       
     </Box>
    </Box>
  )
}

export default LoginPage
