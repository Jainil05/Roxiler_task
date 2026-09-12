const express = require('express');
const { getStores, getStoreById, submitRating } = require('../controllers/storeController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes or you can choose to protect GET /stores. The prompt says "Normal Users should see all registered stores." Let's protect them since it's a login system.
router.use(verifyToken);

router.get('/', getStores);
router.get('/:id', getStoreById);

// Submit or Update Rating (Only users can rate)
// Using PUT since the assignment says "PUT /api/stores/:storeId/rating", but POST works too. We'll support both for flexibility.
router.post('/:storeId/rating', authorizeRoles('user'), submitRating);
router.put('/:storeId/rating', authorizeRoles('user'), submitRating);

module.exports = router;
