import React, { useState,useRef,useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { updateUserStart,updateUserSuccess,updateUserFailure } from '../redux/user/userSlice.js';
import { useDispatch, useSelector  } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';
import { getDownloadURL, getStorage,ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';



function Profile() {
    
  const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const mobileNumberRegex = /^[0-9]{10}$/;
  const [formData, setFormData]  =  useState({})
  const {error,loading,currentUser} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const userRef = useRef()
  const fileRef = useRef()

  const [isEditing, setIsEditing] = useState(false);

  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const[validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);


  const [validMail, setValidMail] = useState(false);
  const [mailFocus, setMailFocus] = useState(false);
  const [uploadFile,setUploadFile] = useState(undefined)
  const [uploadPercentage,setUploadPercentage] = useState(undefined)
  const [fileUploadError,setFileUploadError] = useState(false)
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
            });
          }
        );
    
    }
    else{
        console.log("file is missing")
    }

 
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  

  const hanldeChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name] : e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`http://localhost:8080/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setTimeout(() => dispatch(updateUserFailure(null)), 2000);
        return;
      }
      dispatch(updateUserSuccess(data));
      // navigateTo('/signin');
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setTimeout(() => dispatch(updateUserFailure(null)), 2000);
    }
  }

  useEffect(()=>{
    userRef.current.focus()
},[])

useEffect(() => {
    if (uploadFile) {
        handleFileUpload(uploadFile);
    }
}, [uploadFile]);

useEffect(()=>{
 const isValidName = USER_REGEX.test(formData?.firstName)
 console.log("formData?.firstName",formData?.firstName)
 console.log("ValidName", isValidName)
 setValidName(isValidName)
},[formData?.firstName])


useEffect(()=>{
const isValidPassword = PWD_REGEX.test(formData?.password)
console.log("formData?.password",formData?.password)
console.log("isValidPassword", isValidPassword)
setValidPwd(isValidPassword)
const match = formData?.password === matchPwd;
console.log("matchPwd",matchPwd)
setValidMatch(match)
console.log("ValidMatch",validMatch)
console.log("match",match)
},[formData?.password, matchPwd])

useEffect(() => {
  const isEmail = EMAIL_REGEX.test(formData?.emailOrPhoneNumber);
  const isMobileNumber = mobileNumberRegex.test(formData?.emailOrPhoneNumber);

  if (isEmail) {
    console.log("Email Address:", formData?.emailOrPhoneNumber);
    setValidMail(true);
  } else if (isMobileNumber) {
    console.log("Mobile Number:", formData?.emailOrPhoneNumber);
    setValidMail(true);
  } else {
    console.log("Invalid input:", formData?.emailOrPhoneNumber);
    setValidMail(false);
  }
}, [formData?.emailOrPhoneNumber]);


  return ( 
    <div>
    <Navbar/>
    <div className='signupSection'>
   
    <div className='box box2'>
    <h1> Profile </h1>
    <h3> {(currentUser.firstName).toUpperCase()} {currentUser.lastName} </h3>
       <p className={ error ? "errMsg": "offscreen"} aria-live='assertive'>{error}</p>
      <form id='signUpForm' onSubmit={handleSubmit}>
      <input
      type="file"
      accept="image/*"
      ref={fileRef}
     hidden
      onChange={(e) => setUploadFile(e.target.files[0])}
    />

      <img src={formData.avatar || currentUser.avatar} onClick={() => fileRef.current.click()} id='profile_picture_2' alt='profilepicture'/>
      {fileUploadError ? <p className='errorMsg'>{fileUploadError}</p> : uploadPercentage > 0 && uploadPercentage < 100 ? <p style={{color:"slate",fontWeight:"bold"}}>uploading {uploadPercentage} %</p> : uploadPercentage === 100 ? <p style={{color:"green",fontWeight:"bold"}}>file uploaded successfully..! </p> : " "}
        <input
          ref={userRef}
          autoComplete='off'
          onFocus={()=>setUserFocus(true)}
          onBlur={()=>setUserFocus(false)}
          aria-invalid={ validName ? "false":"true"}
          type='text'
          name='firstName'
          aria-describedby='uidnote'
          placeholder='first name'
          onChange={hanldeChange}
          defaultValue={currentUser.firstName}
          readOnly={!isEditing}
        />
        <p id="uidnote" className={userFocus && formData?.firstName && !validName ? "instructions" : "offscreen"}>
  <FontAwesomeIcon icon={faInfoCircle} />
  4 to 24 characters.<br />
  Must begin with a letter.<br />
  Letters, numbers, underscores, hyphens allowed. </p>
        <input type='text' name='lastName' placeholder='last name'  onChange={hanldeChange}  defaultValue={currentUser?.lastName}  readOnly={!isEditing}/>
        <input
          type='password'
          name='password'
          id='password'
          placeholder='password'
          aria-invalid={ validPwd ? "false":"true"}
          aria-describedby='pwdnote'
          onFocus={()=>setPwdFocus(true)}
          onBlur={()=>setPwdFocus(false)}
          onChange={hanldeChange}
          readOnly={!isEditing}
        />
        <p id='pwdnote' className={  pwdFocus && !validPwd ? "instructions": "offscreen"}>
        <FontAwesomeIcon icon={faInfoCircle}/>
        8 to 24 characters.<br />
        Must include uppercase and lowercase letters, a number and a special character.<br />
        Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollarsign">$</span><span aria-label="percent">%</span>
        </p>
       
        <input
          type='password'
          name='Re-password'
          id='Re-password'
          onChange={(e)=>setMatchPwd(e.target.value)}
          aria-invalid={ validMatch ? "false" : "true"}
          aria-describedby='confirmnote'
          placeholder='Re-enter password'
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
          readOnly={!isEditing}
          
        />
        <p id='confirmnote' className={ matchFocus && !validMatch ? "instructions" :"offscreen"}>
        <FontAwesomeIcon icon={faInfoCircle}/>
        password doesnt match. please enter the same password which you enterd above
        </p>
        <input
          type='text'
          name='emailOrPhoneNumber'
          placeholder='email or phonenumber'
          aria-invalid={validMail? "false":"true"}
          aria-describedby='mailnote'
          onFocus={()=> setMailFocus(true)}
          onBlur={()=>setMailFocus(false)}
          onChange={hanldeChange}
          defaultValue={currentUser.emailOrPhoneNumber}
          readOnly={!isEditing}
        />
        <p id='mailnote' className={mailFocus && !validMail ? "instructions" : "offscreen"}>
        <FontAwesomeIcon icon={faInfoCircle}/>
        please enter a valid mail or phone number
        </p>
        <button type='button' id='editBtn' onClick={handleEditClick} className='signIn'>edit</button>
        <button id='signupBtn' className='signIn' disabled={loading}>
          {loading ? "loading" : "Update"}
        </button>
      </form> 
      <div className='signout_delete'>
      <span> Delete account  </span>
      <span> Sign out </span>
      </div>
    </div>
    </div>
    </div>
  );
}

export default Profile;
