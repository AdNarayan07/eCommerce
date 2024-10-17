require("dotenv").config();
const express = require("express");
const sequelize = require("./database/config");
const cors = require("cors");
const path = require("path");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const fs = require('fs');

require("./models/associations");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Middleware
const serveImages = require("./middleware/serveImages");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Serve product images
app.use('/api/images', serveImages(path.join(__dirname, "database", "product_images")));

const distPath = path.join(__dirname, "dist");

// Check if the directory exists
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });
}

// Sync models and start the server
sequelize.sync().then(async () => {
  try {
    const rootUser = {
      username: "@root",
      displayname: "Administrator",
      email: "root@e.com",
      phone: "9575568415",
      address: "eCommerce App HQ, New Delhi",
      password: bcrypt.hashSync(process.env.ROOT_PASSWORD, 10),
      role: "admin",
    };

    // Check if the root user already exists
    const existingRootUser = await User.findOne({ where: { username: rootUser.username } });

    if (!existingRootUser) await User.create(rootUser);
    else existingRootUser.set(rootUser).save();

    // Start the server
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error(err);
  }
});
