import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const response = await fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert('Registration successful!');
      navigate('/');
    } else {
      alert('Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
