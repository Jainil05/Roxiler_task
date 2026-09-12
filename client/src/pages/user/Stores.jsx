import { useState, useEffect } from 'react';
// import api from '../../../services/api';
import api from '../../services/api';
import Rating from '../../components/Rating';

const UserStores = () => {
    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({ name: '', address: '' });
    const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });

    const fetchStores = async () => {
        try {
            const params = new URLSearchParams({ ...filters, ...sort }).toString();
            // Using /api/stores which is accessible to users
            const res = await api.get(`/stores?${params}`);

            // We need to fetch the user's specific rating for each store
            // For simplicity, we can fetch detailed store info when they click or just display the stores.
            // Since the assignment wants them to see their submitted rating, we should ideally return it from the backend 
            // or fetch /stores/:id for details. Given the constraints, I will add an expand section.

            setStores(res.data.data.map(s => ({ ...s, expanded: false, userRating: 0, loadingRating: false })));
        } catch (err) {
            console.error('Failed to load stores');
        }
    };

    useEffect(() => {
        fetchStores();
    }, [filters, sort]);

    const toggleStoreDetails = async (index) => {
        const newStores = [...stores];
        const store = newStores[index];

        if (!store.expanded) {
            store.loadingRating = true;
            setStores(newStores);

            try {
                const res = await api.get(`/stores/${store.id}`);
                store.userRating = res.data.data.userRating || 0;
            } catch (e) {
                console.error(e);
            }
            store.loadingRating = false;
        }

        store.expanded = !store.expanded;
        setStores([...newStores]);
    };

    const handleRate = async (storeId, index, ratingValue) => {
        try {
            await api.put(`/stores/${storeId}/rating`, { rating: ratingValue });

            // Update local state
            const newStores = [...stores];
            newStores[index].userRating = ratingValue;
            setStores(newStores);

            alert('Rating submitted successfully!');
            // Ideally refresh the average rating by fetching again
            fetchStores();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit rating');
        }
    };

    return (
        <div className="container">
            <h2>Stores</h2>

            <div className="filters-bar card">
                <input type="text" name="name" placeholder="Search Store Name" onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
                <input type="text" name="address" placeholder="Search Address" onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
                <select onChange={(e) => {
                    const [sortBy, order] = e.target.value.split('-');
                    setSort({ sortBy, order });
                }}>
                    <option value="name-asc">Sort: Name (A-Z)</option>
                    <option value="averageRating-desc">Sort: Highest Rated</option>
                    <option value="averageRating-asc">Sort: Lowest Rated</option>
                </select>
            </div>

            <div className="store-list">
                {stores.map((s, index) => (
                    <div key={s.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3>{s.name}</h3>
                                <p style={{ color: '#666' }}>{s.address}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{Number(s.averageRating).toFixed(1)} / 5</div>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>Average Rating</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            <button className="btn btn-secondary" onClick={() => toggleStoreDetails(index)}>
                                {s.expanded ? 'Hide Details' : 'Rate this Store'}
                            </button>

                            {s.expanded && (
                                <div style={{ marginTop: '15px', padding: '15px', background: '#f9f9f9', borderRadius: '4px' }}>
                                    {s.loadingRating ? (
                                        <p>Loading...</p>
                                    ) : (
                                        <div>
                                            <h4>Your Rating</h4>
                                            <p style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#666' }}>
                                                {s.userRating ? 'You have rated this store. Click to modify.' : 'You have not rated this store yet.'}
                                            </p>
                                            <Rating
                                                value={s.userRating}
                                                onChange={(val) => handleRate(s.id, index, val)}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserStores;
