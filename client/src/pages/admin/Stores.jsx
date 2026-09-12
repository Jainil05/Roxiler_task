import { useState, useEffect } from 'react';
// import api from '../../../services/api';
import api from '../../services/api';


const AdminStores = () => {
    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({ name: '', address: '' });
    const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });

    // For creating new store
    const [showCreate, setShowCreate] = useState(false);
    const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerId: '' });
    const [owners, setOwners] = useState([]);
    const [error, setError] = useState('');

    const fetchStores = async () => {
        try {
            const params = new URLSearchParams({ ...filters, ...sort }).toString();
            const res = await api.get(`/admin/stores?${params}`);
            setStores(res.data.data);
        } catch (err) {
            console.error('Failed to load stores');
        }
    };

    const fetchOwners = async () => {
        try {
            const res = await api.get('/admin/users?role=store_owner');
            setOwners(res.data.data);
            if (res.data.data.length > 0 && !newStore.ownerId) {
                setNewStore(prev => ({ ...prev, ownerId: res.data.data[0].id }));
            }
        } catch (err) {
            console.error('Failed to load owners');
        }
    };

    useEffect(() => {
        fetchStores();
    }, [filters, sort]);

    useEffect(() => {
        fetchOwners();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/admin/stores', newStore);
            setShowCreate(false);
            setNewStore({ name: '', email: '', address: '', ownerId: '' });
            fetchStores();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create store');
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Store Management</h2>
                <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
                    {showCreate ? 'Cancel' : 'Add Store'}
                </button>
            </div>

            {showCreate && (
                <div className="card" style={{ marginTop: '20px' }}>
                    <h3>Create New Store</h3>
                    {error && <div className="error-text">{error}</div>}
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label>Store Name</label>
                            <input type="text" className="form-control" required value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Store Email</label>
                            <input type="email" className="form-control" required value={newStore.email} onChange={(e) => setNewStore({ ...newStore, email: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input type="text" className="form-control" value={newStore.address} onChange={(e) => setNewStore({ ...newStore, address: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Store Owner</label>
                            {owners.length === 0 ? (
                                <p style={{ color: '#c00', fontSize: '0.9rem' }}>
                                    No Store Owners found. Please create a Store Owner first from the "Users" page.
                                </p>
                            ) : (
                                <select
                                    className="form-control"
                                    required
                                    value={newStore.ownerId}
                                    onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
                                >
                                    <option value="">-- Select Store Owner --</option>
                                    {owners.map(o => (
                                        <option key={o.id} value={o.id}>
                                            {o.name} ({o.email}) - ID: {o.id}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <button type="submit" className="btn btn-success">Save Store</button>
                    </form>
                </div>
            )}

            <div className="filters-bar card" style={{ marginTop: '20px' }}>
                <input type="text" name="name" placeholder="Search Store Name" onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
                <input type="text" name="address" placeholder="Search Address" onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
                <select onChange={(e) => {
                    const [sortBy, order] = e.target.value.split('-');
                    setSort({ sortBy, order });
                }}>
                    <option value="name-asc">Sort: Name (A-Z)</option>
                    <option value="name-desc">Sort: Name (Z-A)</option>
                    <option value="averageRating-desc">Sort: Highest Rated</option>
                    <option value="averageRating-asc">Sort: Lowest Rated</option>
                </select>
            </div>

            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Store Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Owner ID</th>
                            <th>Avg Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map(s => (
                            <tr key={s.id}>
                                <td>{s.name}</td>
                                <td>{s.email}</td>
                                <td>{s.address}</td>
                                <td>{s.owner_id}</td>
                                <td>{Number(s.averageRating).toFixed(1)} / 5</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminStores;
