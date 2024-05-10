import React, { useState } from 'react';
import axios from 'axios';

const ResetPasswordComponent = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

    

  const handleResetPassword = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    // Basic reset token validation
    if (!resetToken) {
      setMessage('Please enter the reset token.');
      return;
    }

    // Basic password validation
    if (!newPassword || newPassword.length < 7) {
      setMessage('Password must be at least 7 characters long.');
      return;
    }
    try {
      await axios.post('http://localhost:3000/api/users/reset-password', { email, resetToken, newPassword });
      setMessage('Password reset successful');
    } catch (error) {
      setMessage('Invalid or expired token');
      console.error(error);
    }
  };

  return (
    <div style={styles.resetPasswordContainer}>
      <h2>Reset Password</h2>
      <form>
        <div style={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="resetToken">Reset Token</label>
          <input type="text" id="resetToken" placeholder="Reset Token" onChange={(e) => setResetToken(e.target.value)} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="newPassword">New Password</label>
          <input type="password" id="newPassword" placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)} style={styles.input} />
        </div>
        <button onClick={handleResetPassword} style={styles.button}>Reset Password</button>
        <p style={styles.message}onChange={(e)=>setMessage(e.target.value)}></p>
        
      </form>
    </div>
  );
};

const styles = {
  resetPasswordContainer: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '10px',
    color: 'ivory'
  },
};

export default ResetPasswordComponent;
