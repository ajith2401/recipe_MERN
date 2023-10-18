import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const navigateTo = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);

  const hideError = () => {
    setError(false);
  };

  const hanldeChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const hanldePassword = (e) => {
    if (e.target.value !== formData.password) {
      setPasswordErr("Password does not match");
    } else {
      setPasswordErr(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        // Automatically hide the error message after 0.5 seconds
        setTimeout(() => {
          hideError();
        }, 500);
        return;
      }
      setLoading(false);
      setError(null);
      navigateTo('/');
    } catch (error) {
      setLoading(false);
      setError(error.message);
      // Automatically hide the error message after 0.5 seconds
      setTimeout(() => {
        hideError();
      }, 500);
    }
  };

  return ( 
    <div>
      <h2> Signup </h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form id='signUpForm' onSubmit={handleSubmit}>
        <input
          type='text'
          name='firstName'
          placeholder='first name'
          required
          onChange={hanldeChange}
        />
        <input type='text' name='lastName' placeholder='last name' onChange={hanldeChange} />
        <input
          type='password'
          name='password'
          id='password'
          placeholder='password'
          required
          onChange={hanldeChange}
        />
        {passwordErr && <small>{passwordErr}</small>}
        <input
          type='password'
          name='Re-password'
          id='Re-password'
          placeholder='Re enter password'
          required
          onChange={hanldePassword}
        />
        <input
          type='text'
          name='emailOrPhoneNumber'
          placeholder='email or phonenumber'
          required
          onChange={hanldeChange}
        />
        <button id='signupBtn' disabled={loading}>
          {loading ? "loading" : "Signup"}
        </button>
      </form>
      <p>have an account </p> <Link to='/'>sign in </Link>
    </div>
  );
}

export default Signup;
