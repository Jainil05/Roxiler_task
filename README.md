# Store Rating Web Application

A full-stack web application built for a coding challenge. Users can register and rate stores. The application features three distinct roles with their own dashboards and permissions: Admin, Normal User, and Store Owner.

## Tech Stack
- **Frontend**: React.js (Vite), React Router, Axios, CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL (using `mysql2` and raw SQL)
- **Authentication**: JWT, bcrypt

## Features
- **Admin**: Dashboard with statistics, manage users, manage stores, filter and sort capabilities.
- **Store Owner**: Dashboard to view their own stores, average ratings, and individual reviews.
- **Normal User**: Browse all stores, view average ratings, submit a rating (1-5), and modify their existing rating. 

## Folder Structure
```
.
├── client/          # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI elements (Navbar, Rating, ProtectedRoute)
│   │   ├── context/     # AuthContext for global state
│   │   ├── pages/       # Page components categorized by role
│   │   └── services/    # Axios API configuration
├── server/          # Express Backend
│   ├── config/      # Database connection
│   ├── controllers/ # Request handlers
│   ├── middleware/  # JWT auth and Role authorization
│   ├── models/      # SQL queries and DB logic
│   ├── routes/      # Express routes mapping
│   └── utils/       # Validation logic
└── database.sql     # Database schema and seed data
```

## Setup Instructions

### 1. Database Setup
1. Make sure you have MySQL installed and running.
2. Create a database named `store_rating_app`.
3. Import the schema and seed data:
   ```bash
   mysql -u root -p < database.sql
   ```

### 2. Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=store_rating_app
   JWT_SECRET=super_secret_jwt_key_example
   ```
4. Start the server: `npm run dev` (or `node server.js`)

### 3. Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`

## Demo Credentials
All seeded users share the same password for testing purposes.
**Password**: `Password@123`

- **Admin**: `admin@example.com`
- **Store Owner**: `owner1@example.com`
- **Normal User**: `user1@example.com`
- **Normal User 2**: `user2@example.com`
