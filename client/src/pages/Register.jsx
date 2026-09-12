import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', address: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { registerUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Basic frontend validation matches backend
        if (formData.name.length < 20 || formData.name.length > 60) {
            return setError('Name must be between 20 and 60 characters');
        }
        const pwdRe = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
        if (!pwdRe.test(formData.password)) {
            return setError('Password must be 8-16 characters with at least 1 uppercase and 1 special character');
        }

        try {
            await registerUser(formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-container card">
            <h2>Register</h2>
            {error && <div className="error-text">{error}</div>}
            {success && <div className="success-text">Registration successful! Redirecting...</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" required className="form-control" onChange={handleChange} minLength={20} maxLength={60} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required className="form-control" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" required className="form-control" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Address (max 400 chars)</label>
                    <textarea name="address" className="form-control" onChange={handleChange} maxLength={400}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
            </form>
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default Register;
