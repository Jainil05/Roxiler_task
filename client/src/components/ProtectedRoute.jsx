import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect based on role if they try to access unauthorized route
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'store_owner') return <Navigate to="/owner/dashboard" replace />;
        return <Navigate to="/user/stores" replace />;
    }

    return children;
};

export default ProtectedRoute;
