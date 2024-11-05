import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import '../style/Dashboard.css';

const Dashboard = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // Use logout function from context

  const fetchSites = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not authorized. Please login again.');
        navigate('/login', { replace: true }); // Redirect if no token
        return;
      }

      const response = await fetch('http://localhost:8080/sites', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSites(data);
      } else {
        const message = await response.json();
        setError(message.error || 'Failed to fetch sites.');
      }
    } catch (err) {
      console.error('Error fetching sites:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false); // Stop loading when fetch completes
    }
  }, [navigate]); // Depend on navigate to ensure it has the latest value

  useEffect(() => {
    fetchSites(); // Fetch user’s sites when the component loads
  }, [fetchSites]); // Add fetchSites to the dependency array

  const handleDelete = async (siteId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/sites/${siteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchSites(); // Refresh site list after deletion
      } else {
        alert('Failed to delete the site.');
      }
    } catch (err) {
      console.error('Error deleting site:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleLogout = () => {
    logout(); // Call logout from context to clear token and redirect
    navigate('/login', { replace: true }); // Redirect to login
  };

  if (loading) return <p>Loading your websites...</p>; // Show loading state
  if (error) return <p>Error: {error}</p>; // Show error state

  return (
    <div className="dashboard-container">
      <h1>Your Websites</h1>
      <button onClick={() => navigate('/create-site')}>Create New Website</button>
      <ul>
        {sites.length > 0 ? (
          sites.map((site) => (
            <li key={site.id}>
              {site.siteName}
              <button onClick={() => navigate(`/edit-site/${site.id}`)}>Edit</button>
              <button onClick={() => handleDelete(site.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No websites found. Create your first site!</p>
        )}
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
