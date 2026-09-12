const storeModel = require('../models/storeModel');
const ratingModel = require('../models/ratingModel');
const { validateRating } = require('../utils/validation');

const getStores = async (req, res) => {
    try {
        const { name, address, sortBy, order } = req.query;
        const stores = await storeModel.getStores({ name, address }, { sortBy, order });
        res.status(200).json({ data: stores });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getStoreById = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await storeModel.getStoreById(id);
        
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        
        // If logged in, get user's specific rating
        let userRating = null;
        if (req.user && req.user.role === 'user') {
            userRating = await ratingModel.getUserRatingForStore(req.user.id, id);
        }

        res.status(200).json({ data: { store, userRating: userRating ? userRating.rating : null } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const submitRating = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { rating } = req.body;
        const userId = req.user.id; // from authMiddleware

        if (!validateRating(rating)) {
            return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
        }

        const store = await storeModel.getStoreById(storeId);
        if (!store) return res.status(404).json({ message: 'Store not found' });

        await ratingModel.submitRating(userId, storeId, rating);

        res.status(200).json({ message: 'Rating submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getStores,
    getStoreById,
    submitRating
};
