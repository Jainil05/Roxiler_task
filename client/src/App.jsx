import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminStores from './pages/admin/Stores';
import UserStores from './pages/user/Stores';
import OwnerDashboard from './pages/owner/Dashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminUsers />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/stores" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminStores />
                        </ProtectedRoute>
                    } />

                    {/* Owner Routes */}
                    <Route path="/owner/dashboard" element={
                        <ProtectedRoute allowedRoles={['store_owner']}>
                            <OwnerDashboard />
                        </ProtectedRoute>
                    } />

                    {/* User Routes */}
                    <Route path="/user/stores" element={
                        <ProtectedRoute allowedRoles={['user']}>
                            <UserStores />
                        </ProtectedRoute>
                    } />

                    {/* Default Route */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
