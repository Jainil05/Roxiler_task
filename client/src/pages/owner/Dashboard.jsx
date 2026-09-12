import { useState, useEffect } from 'react';
// import api from '../../../services/api';
import api from '../../services/api';


const OwnerDashboard = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/owner/dashboard');
                setStores(res.data.data.stores || []);
            } catch (err) {
                setError('Failed to load owner dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-text">{error}</div>;

    if (stores.length === 0) {
        return (
            <div className="container">
                <h2>My Dashboard</h2>
                <div className="card">
                    <p>You don't own any stores yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h2>My Dashboard</h2>
            {stores.map(store => (
                <div key={store.id} className="card" style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                        <div>
                            <h3>{store.name}</h3>
                            <p style={{ color: '#666' }}>{store.address} | {store.email}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>
                                {Number(store.averageRating).toFixed(1)} / 5
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>Average Rating</div>
                        </div>
                    </div>

                    <h4>Ratings Received</h4>
                    {store.ratings && store.ratings.length > 0 ? (
                        <table style={{ marginTop: '10px' }}>
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Rating</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {store.ratings.map(r => (
                                    <tr key={r.id}>
                                        <td>{r.name}</td>
                                        <td>{r.email}</td>
                                        <td>{r.rating} ★</td>
                                        <td>{new Date(r.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ color: '#666' }}>No ratings yet.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default OwnerDashboard;
