CREATE DATABASE IF NOT EXISTS store_rating_app;
USE store_rating_app;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    role ENUM('admin', 'user', 'store_owner') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    address VARCHAR(400),
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE(user_id, store_id) -- Ensures a user can only have one rating for one store
);

-- Useful Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_stores_owner_id ON stores(owner_id);

-- Seed Data
-- Note: All passwords are set to 'Password@123'
-- Hash generated using bcrypt with salt rounds = 10
-- Hash: $2b$10$RzJSTS/SsCMjr5.QQqkolu9TMaGMAGsQBwr9EA/63g9OaU7lvz7sm

INSERT INTO users (name, email, password, address, role) VALUES
('System Admin', 'admin@example.com', '$2b$10$RzJSTS/SsCMjr5.QQqkolu9TMaGMAGsQBwr9EA/63g9OaU7lvz7sm', 'Admin HQ', 'admin'),
('Store Owner 1', 'owner1@example.com', '$2b$10$RzJSTS/SsCMjr5.QQqkolu9TMaGMAGsQBwr9EA/63g9OaU7lvz7sm', 'Store Address 1', 'store_owner'),
('Normal User 1', 'user1@example.com', '$2b$10$RzJSTS/SsCMjr5.QQqkolu9TMaGMAGsQBwr9EA/63g9OaU7lvz7sm', 'User Home 1', 'user'),
('Normal User 2', 'user2@example.com', '$2b$10$RzJSTS/SsCMjr5.QQqkolu9TMaGMAGsQBwr9EA/63g9OaU7lvz7sm', 'User Home 2', 'user');

-- Seed Stores (assuming owner_id 2 belongs to 'Store Owner 1')
INSERT INTO stores (name, email, address, owner_id) VALUES
('Super Mart', 'contact@supermart.com', '123 Market St', 2),
('Tech Haven', 'info@techhaven.com', '456 Tech Park', 2);

-- Seed Ratings
-- User 3 (user1) rates Super Mart (Store 1) 4 stars
INSERT INTO ratings (user_id, store_id, rating) VALUES
(3, 1, 4),
(4, 1, 5),
(3, 2, 3);
