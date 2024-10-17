// Load environment variables from the .env file
require("dotenv").config();

// Import necessary modules
const express = require("express");
const sequelize = require("./database/config");  // Sequelize ORM for database management
const cors = require("cors");  // Middleware for handling Cross-Origin Resource Sharing
const path = require("path");  // Module for handling and transforming file paths
const User = require("./models/user");  // User model for database operations
const bcrypt = require("bcryptjs");  // Library for hashing passwords securely
const fs = require('fs');  // File system module for interacting with the file system

// Import associations (relationships between models like User and Orders)
require("./models/associations");

// Import route modules
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Import middleware to serve product images
const serveImages = require("./middleware/serveImages");

// Initialize the Express app
const app = express();

// Set the port for the server, defaulting to 3000 if not provided in environment variables
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests and limit the request body size to 10MB
app.use(express.json({ limit: "10mb" }));

// Enable CORS for allowing cross-origin requests
app.use(cors());

// Register route handlers with specific base paths
app.use("/api/auth", authRoutes);  // Routes for authentication (login, registration, etc.)
app.use("/api/users", userRoutes);  // Routes for managing users (e.g., getting user data)
app.use("/api/products", productRoutes);  // Routes for managing products (CRUD operations)
app.use("/api/orders", orderRoutes);  // Routes for managing orders (placing, viewing orders)

// Middleware to serve product images from the specified directory
app.use('/api/images', serveImages(path.join(__dirname, "database", "product_images")));

// Define the path to the build folder (for serving the frontend)
const distPath = path.join(__dirname, "dist");

// Check if the 'dist' folder exists (for serving static files like HTML, CSS, JS)
if (fs.existsSync(distPath)) {
    // Serve static files from the 'dist' folder
    app.use(express.static(distPath));

    // For any route not handled by the API, serve the frontend's index.html
    app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });
}

// Sync the Sequelize models with the database and then start the server
sequelize.sync().then(async () => {
  try {
    // Define a default root user with pre-set details
    const rootUser = {
      username: "@root",
      displayname: "Administrator",
      email: "root@e.com",
      phone: "9575568415",
      address: "eCommerce App HQ, New Delhi",
      password: bcrypt.hashSync(process.env.ROOT_PASSWORD, 10),  // Hash the admin's password securely
      role: "admin",
    };

    // Check if the root user already exists in the database
    const existingRootUser = await User.findOne({ where: { username: rootUser.username } });

    // If the root user doesn't exist, create them; otherwise, update the existing record
    if (!existingRootUser) await User.create(rootUser);
    else existingRootUser.set(rootUser).save();

    // Start the server and listen on the defined port
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    // Handle errors during the model synchronization or server startup
    console.error(err);
  }
});
