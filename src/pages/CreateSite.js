import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateSite = () => {
  const [siteName, setSiteName] = useState(''); // Website name
  const [username, setUsername] = useState(''); // Username
  const [domain, setDomain] = useState(''); // Domain name
  const navigate = useNavigate();

  const handleCreate = async () => {
    const token = localStorage.getItem('token');

    // Validate input fields before making the API call
    if (!siteName || !username || !domain) {
      alert('Please fill in all fields.');
      return;
    }

    const response = await fetch('http://localhost:8080/sites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ siteName, username, domain }), // Include all fields
    });

    if (response.ok) {
      const newSite = await response.json();
      navigate(`/edit-site/${newSite.id}`); // Redirect to builder page
    } else {
      // Handle errors
      const errorMessage = await response.text();
      alert(`Error creating site: ${errorMessage}`);
    }
  };

  return (
    <div className="create-site-container">
      <h1>Create New Website</h1>
      <input
        type="text"
        placeholder="Enter Website Name"
        value={siteName}
        onChange={(e) => setSiteName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Domain Name"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />
      <button onClick={handleCreate}>Next</button>
    </div>
  );
};

export default CreateSite;
