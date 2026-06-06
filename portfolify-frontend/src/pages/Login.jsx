import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Update state when the user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send login credentials to the backend
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Save the VIP badge (JWT Token) to local storage
      localStorage.setItem('token', response.data.token);
      
      // Redirect securely to the dashboard
      navigate('/dashboard'); 
    } catch (err) {
      // Display error if wrong email or password
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: '20px' }}>Welcome Back 🔑</h2>
        
        {/* Error Message Box */}
        {error && <div style={styles.errorBox}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
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
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            style={styles.input} 
          />
          
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '20px', color: '#aaa' }}>
          Don't have an account yet? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

// Reusing the same clean dark-mode styling from Registration
const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '50px' },
  card: { backgroundColor: '#2a2a40', padding: '40px', borderRadius: '10px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#1e1e2f', color: 'white', fontSize: '16px' },
  button: { padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#61dafb', color: '#000', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  errorBox: { backgroundColor: '#ff4d4d', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '15px' },
  link: { color: '#61dafb', textDecoration: 'none', fontWeight: 'bold' }
};

export default Login;