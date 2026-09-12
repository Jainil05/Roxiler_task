const pool = require('../config/db');

const getUsers = async (filters = {}, sort = {}) => {
    let query = 'SELECT id, name, email, address, role, created_at, updated_at FROM users';
    const queryParams = [];
    const whereClauses = [];

    if (filters.name) {
        whereClauses.push('name LIKE ?');
        queryParams.push(`%${filters.name}%`);
    }
    if (filters.email) {
        whereClauses.push('email LIKE ?');
        queryParams.push(`%${filters.email}%`);
    }
    if (filters.address) {
        whereClauses.push('address LIKE ?');
        queryParams.push(`%${filters.address}%`);
    }
    if (filters.role) {
        whereClauses.push('role = ?');
        queryParams.push(filters.role);
    }

    if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
    }

    // Whitelisted sort fields
    const allowedSortFields = ['name', 'email', 'address', 'role', 'created_at'];
    const sortBy = allowedSortFields.includes(sort.sortBy) ? sort.sortBy : 'name';
    const order = sort.order && sort.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${sortBy} ${order}`;

    const [rows] = await pool.execute(query, queryParams);
    return rows;
};

const countUsers = async () => {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM users');
    return rows[0].count;
};

const findUserByIdSafe = async (id) => {
    const [rows] = await pool.execute('SELECT id, name, email, address, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
};

const createUser = async (userData) => {
    const { name, email, password, address, role } = userData;
    const [result] = await pool.execute(
        'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        [name, email, password, address, role || 'user']
    );
    return result;
};

const findUserByEmail = async (email) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

const findUserById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
};

const updateUserPassword = async (id, hashedPassword) => {
    const [result] = await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return result;
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    findUserByIdSafe,
    getUsers,
    countUsers,
    updateUserPassword
};
