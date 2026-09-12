const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const storeModel = require('../models/storeModel');
const ratingModel = require('../models/ratingModel');
const { validateEmail, validatePassword, validateName, validateAddress } = require('../utils/validation');

const getDashboardStats = async (req, res) => {
    try {
        const usersCount = await userModel.countUsers();
        const storesCount = await storeModel.countStores();
        const ratingsCount = await ratingModel.countRatings();

        res.status(200).json({
            message: 'Dashboard stats fetched successfully',
            data: {
                totalUsers: usersCount,
                totalStores: storesCount,
                totalRatings: ratingsCount
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        if (!validateName(name)) return res.status(400).json({ message: 'Invalid name length' });
        if (!validateEmail(email)) return res.status(400).json({ message: 'Invalid email' });
        if (!validatePassword(password)) return res.status(400).json({ message: 'Invalid password format' });
        
        const validRoles = ['admin', 'user', 'store_owner'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) return res.status(409).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.createUser({ name, email, password: hashedPassword, address, role });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUsers = async (req, res) => {
    try {
        const { name, email, address, role, sortBy, order } = req.query;
        const users = await userModel.getUsers({ name, email, address, role }, { sortBy, order });
        res.status(200).json({ data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findUserByIdSafe(id);
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        let storeData = null;
        if (user.role === 'store_owner') {
            storeData = await storeModel.getStoresByOwner(id);
        }

        res.status(200).json({ data: { user, stores: storeData } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createStore = async (req, res) => {
    try {
        const { name, email, address, ownerId } = req.body;

        if (!name || name.length < 3) return res.status(400).json({ message: 'Invalid store name' });
        if (!ownerId) return res.status(400).json({ message: 'Owner ID is required' });

        // Ensure owner exists and is a store_owner
        const owner = await userModel.findUserByIdSafe(ownerId);
        if (!owner || owner.role !== 'store_owner') {
            return res.status(400).json({ message: 'Invalid owner ID or user is not a store owner' });
        }

        await storeModel.createStore({ name, email, address, ownerId });
        res.status(201).json({ message: 'Store created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

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

module.exports = {
    getDashboardStats,
    createUser,
    getUsers,
    getUserDetails,
    createStore,
    getStores
};
