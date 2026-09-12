import { useState, useEffect } from 'react';
// import api from '../../../services/api';
import api from '../../services/api';


const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ name: '', email: '', role: '' });
    const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });

    // For creating new user / store owner
    const [showCreate, setShowCreate] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'store_owner'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchUsers = async () => {
        try {
            const params = new URLSearchParams({ ...filters, ...sort }).toString();
            const res = await api.get(`/admin/users?${params}`);
            setUsers(res.data.data);
        } catch (err) {
            console.error('Failed to load users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filters, sort]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSortChange = (e) => {
        const [sortBy, order] = e.target.value.split('-');
        setSort({ sortBy, order });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic client validation matching requirements
        if (newUser.name.length < 20 || newUser.name.length > 60) {
            setError('Name must be between 20 and 60 characters');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newUser.email)) {
            setError('Invalid email address format');
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
        if (!passwordRegex.test(newUser.password)) {
            setError('Password must be 8-16 characters, with at least 1 uppercase letter and 1 special character');
            return;
        }

        try {
            await api.post('/admin/users', newUser);
            setSuccess('User created successfully!');
            setNewUser({ name: '', email: '', password: '', address: '', role: 'store_owner' });
            setShowCreate(false);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>User Management</h2>
                <button className="btn btn-primary" onClick={() => {
                    setShowCreate(!showCreate);
                    setError('');
                    setSuccess('');
                }}>
                    {showCreate ? 'Cancel' : 'Add User / Store Owner'}
                </button>
            </div>

            {success && <div className="card" style={{ marginTop: '15px', color: '#155724', background: '#d4edda' }}>{success}</div>}

            {showCreate && (
                <div className="card" style={{ marginTop: '20px' }}>
                    <h3>Create New User / Store Owner</h3>
                    {error && <div className="error-text" style={{ marginBottom: '10px' }}>{error}</div>}
                    <form onSubmit={handleCreateUser}>
                        <div className="form-group">
                            <label>Full Name (20–60 characters)</label>
                            <input
                                type="text"
                                className="form-control"
                                required
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                placeholder="e.g. Alexander Johnathan Store"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                required
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                placeholder="e.g. owner@example.com"
                            />
                        </div>
                        <div className="form-group">
                            <label>Password (8–16 chars, 1 uppercase, 1 special char)</label>
                            <input
                                type="password"
                                className="form-control"
                                required
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                placeholder="e.g. Password@123"
                            />
                        </div>
                        <div className="form-group">
                            <label>Address (Max 400 characters)</label>
                            <textarea
                                className="form-control"
                                rows="2"
                                value={newUser.address}
                                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                                placeholder="e.g. 100 Main Street, Suite 200"
                            />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select
                                className="form-control"
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="store_owner">Store Owner</option>
                                <option value="admin">System Admin</option>
                                <option value="user">Normal User</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-success">Save User</button>
                    </form>
                </div>
            )}

            <div className="filters-bar card" style={{ marginTop: '20px' }}>
                <input type="text" name="name" placeholder="Search Name" onChange={handleFilterChange} />
                <input type="text" name="email" placeholder="Search Email" onChange={handleFilterChange} />
                <select name="role" onChange={handleFilterChange}>
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="store_owner">Store Owner</option>
                </select>
                <select onChange={handleSortChange}>
                    <option value="name-asc">Sort: Name (A-Z)</option>
                    <option value="name-desc">Sort: Name (Z-A)</option>
                    <option value="email-asc">Sort: Email (A-Z)</option>
                    <option value="created_at-desc">Sort: Newest</option>
                </select>
            </div>

            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Address</th>
                            <th>Registered At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                                <td>{u.address}</td>
                                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
