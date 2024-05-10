import React, { useState } from 'react';
import axios from 'axios';
import '../index.css'
const ForgotPasswordComponent = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async () => {
    try {
      await axios.post('http://localhost:3000/api/users/forgot-password', { email });
      setMessage('Reset password email sent successfully check your mail');
    } catch (error) {
      setMessage('Error sending reset password email');
      console.error(error);
    }
  };

  return (
    <div className='forgot'>
      <h2 style={{color:'white'}}>Forgot Password</h2>
      <input  type="email" placeholder="Email" class="custom-input" size={50} onChange={(e) => setEmail(e.target.value)} />
      <button class='forgot' onClick={handleForgotPassword}>Send Reset Email</button>
      <p style={{ fontFamily: 'Times New Roman', color: 'snowwhite' }}>{message}</p>
    </div>
  );
};

export default ForgotPasswordComponent;