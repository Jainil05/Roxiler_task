const pool = require('../config/db');

const submitRating = async (userId, storeId, rating) => {
    // Upsert logic for rating (UNIQUE constraint on user_id, store_id)
    const [result] = await pool.execute(
        `INSERT INTO ratings (user_id, store_id, rating) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
        [userId, storeId, rating]
    );
    return result;
};

const getRatingsByStore = async (storeId) => {
    const [rows] = await pool.execute(`
        SELECT r.id, r.rating, r.created_at, u.name, u.email 
        FROM ratings r
        JOIN users u ON r.user_id = u.id
        WHERE r.store_id = ?
        ORDER BY r.created_at DESC
    `, [storeId]);
    return rows;
};

const getUserRatingForStore = async (userId, storeId) => {
    const [rows] = await pool.execute(
        'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
        [userId, storeId]
    );
    return rows[0];
};

const countRatings = async () => {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM ratings');
    return rows[0].count;
};

module.exports = {
    submitRating,
    getRatingsByStore,
    getUserRatingForStore,
    countRatings
};
