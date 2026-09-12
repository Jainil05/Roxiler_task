const express = require('express');
const { getDashboardStats, createUser, getUsers, getUserDetails, createStore, getStores } = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// All admin routes are protected by auth AND admin role
router.use(verifyToken, authorizeRoles('admin'));

router.get('/dashboard', getDashboardStats);

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);

router.post('/stores', createStore);
router.get('/stores', getStores);

module.exports = router;
