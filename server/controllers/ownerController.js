const storeModel = require('../models/storeModel');
const ratingModel = require('../models/ratingModel');

const getDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;
        
        // Find stores owned by this owner
        const stores = await storeModel.getStoresByOwner(ownerId);
        
        // If owner doesn't have a store, return empty data
        if (!stores || stores.length === 0) {
            return res.status(200).json({ data: { stores: [] } });
        }

        // Fetch ratings for each store
        const dashboardData = await Promise.all(stores.map(async (store) => {
            const ratings = await ratingModel.getRatingsByStore(store.id);
            return {
                ...store,
                ratings
            };
        }));

        res.status(200).json({ data: { stores: dashboardData } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getDashboard
};
