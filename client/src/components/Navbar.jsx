import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" style={{ color: '#333' }}>Store Rating System</Link>
            </div>
            <div className="navbar-links">
                {user ? (
                    <>
                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin/dashboard">Dashboard</Link>
                                <Link to="/admin/users">Users</Link>
                                <Link to="/admin/stores">Stores</Link>
                            </>
                        )}
                        {user.role === 'store_owner' && (
                            <Link to="/owner/dashboard">My Dashboard</Link>
                        )}
                        {user.role === 'user' && (
                            <Link to="/user/stores">Stores</Link>
                        )}
                        <span style={{ marginLeft: '20px', color: '#666' }}>Hello, {user.name}</span>
                        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register" className="btn btn-primary" style={{ color: '#fff' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
