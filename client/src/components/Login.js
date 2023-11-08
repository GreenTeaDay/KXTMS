import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Match this URL to your backend's login route
      const response = await axios.post('http://localhost:3000/users/login', { 
        email, 
        password 
      });
      
      // Handle login success (e.g., save token to localStorage, redirect, etc.)
      localStorage.setItem('token', response.data.token);
      console.log('Login successful:', response.data);
    } catch (error) {
      console.error('Login error:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Log In</button>
    </form>
  );
}

export default Login;
