import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  // 1. State to hold our form typing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // 2. Update state when the user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the page from refreshing
    setError('');
    setLoading(true);

    try {
      // Send the data to your Node.js backend!
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // If successful, save the VIP badge (JWT Token) to the browser's local memory
      localStorage.setItem('token', response.data.token);
      
      // Redirect the user to their dashboard
      navigate('/dashboard'); 
    } catch (err) {
      // If the backend sends an error (like "Email already exists"), display it
      setError(err.response?.data?.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: '20px' }}>Create an Account 🚀</h2>
        
        {/* Display error messages in a red box */}
        {error && <div style={styles.errorBox}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            style={styles.input} 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            style={styles.input} 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password (min 6 characters)" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            style={styles.input} 
          />
          
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '20px', color: '#aaa' }}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

// Basic inline styling for a clean dark-mode look
const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '50px' },
  card: { backgroundColor: '#2a2a40', padding: '40px', borderRadius: '10px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#1e1e2f', color: 'white', fontSize: '16px' },
  button: { padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#61dafb', color: '#000', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  errorBox: { backgroundColor: '#ff4d4d', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '15px' },
  link: { color: '#61dafb', textDecoration: 'none', fontWeight: 'bold' }
};

export default Register;