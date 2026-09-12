const pool = require('../config/db');

const createStore = async (storeData) => {
    const { name, email, address, ownerId } = storeData;
    const [result] = await pool.execute(
        'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
        [name, email, address, ownerId]
    );
    return result;
};

const getStores = async (filters = {}, sort = {}) => {
    let query = `
        SELECT s.*, 
               COALESCE(AVG(r.rating), 0) AS averageRating 
        FROM stores s 
        LEFT JOIN ratings r ON s.id = r.store_id
    `;
    const queryParams = [];
    const whereClauses = [];

    if (filters.name) {
        whereClauses.push('s.name LIKE ?');
        queryParams.push(`%${filters.name}%`);
    }
    if (filters.address) {
        whereClauses.push('s.address LIKE ?');
        queryParams.push(`%${filters.address}%`);
    }

    if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
    }

    query += ' GROUP BY s.id';

    // Whitelisted sort fields
    const allowedSortFields = ['name', 'address', 'averageRating'];
    const sortBy = allowedSortFields.includes(sort.sortBy) ? sort.sortBy : 'name';
    const order = sort.order && sort.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${sortBy} ${order}`;

    const [rows] = await pool.execute(query, queryParams);
    return rows;
};

const getStoreById = async (id) => {
    const [rows] = await pool.execute(`
        SELECT s.*, 
               COALESCE(AVG(r.rating), 0) AS averageRating 
        FROM stores s 
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE s.id = ?
        GROUP BY s.id
    `, [id]);
    return rows[0];
};

const getStoresByOwner = async (ownerId) => {
    const [rows] = await pool.execute(`
        SELECT s.*, 
               COALESCE(AVG(r.rating), 0) AS averageRating 
        FROM stores s 
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE s.owner_id = ?
        GROUP BY s.id
    `, [ownerId]);
    return rows;
};

const countStores = async () => {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM stores');
    return rows[0].count;
};

module.exports = {
    createStore,
    getStores,
    getStoreById,
    getStoresByOwner,
    countStores
};
