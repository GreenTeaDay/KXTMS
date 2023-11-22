import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';  // Make sure this path is correct

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      console.log('Login successful:', response.data);
      navigate('/quote');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className='login-wrapper'>
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Start Smart Shipping with K&X: Booking & Quoting</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Log In</button>
      </form>
    </div>
    </div>
  );
}

export default Login;
