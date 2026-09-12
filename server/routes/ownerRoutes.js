const express = require('express');
const { getDashboard } = require('../controllers/ownerController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(verifyToken, authorizeRoles('store_owner'));

router.get('/dashboard', getDashboard);

module.exports = router;
