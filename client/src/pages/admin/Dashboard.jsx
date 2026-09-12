import { useState, useEffect } from 'react';
// import api from '../../../services/api';
import api from '../../services/api';


const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                setStats(res.data.data);
            } catch (err) {
                setError('Failed to load dashboard stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;
    if (error) return <div className="error-text">{error}</div>;

    return (
        <div className="container">
            <h2>Admin Dashboard</h2>
            <div className="dashboard-stats" style={{ marginTop: '20px' }}>
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Stores</h3>
                    <p>{stats.totalStores}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Ratings</h3>
                    <p>{stats.totalRatings}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
