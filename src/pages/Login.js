import React, { useState, useLayoutEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // Use login function from context
  const navigate = useNavigate();

  // Check for token and redirect if already logged in
  useLayoutEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token detected. Redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token); // Save token to localStorage
          console.log('Login successful. Token saved.');
          login(data.token); // Use the login function from context
          navigate('/dashboard', { replace: true }); // Redirect to dashboard
        } else {
          alert('Invalid credentials.');
        }
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
