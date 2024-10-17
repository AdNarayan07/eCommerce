const Product = require('./product'); // Import the Product model
const User = require('./user'); // Import the User model
const Comment = require('./comment'); // Import the Comment model
const Orders = require('./order'); // Import the Orders model
const { deleteImage } = require('../controllers/productController'); // Import the deleteImage function from the product controller

// Associate Product with User (Seller)
Product.belongsTo(User, {
  foreignKey: 'seller',  // Link the 'seller' field in Product to 'User.username'
  onDelete: 'CASCADE',   // If the User (Seller) is deleted, all associated Products will also be deleted
});

// Hook to run after a Product is destroyed
Product.afterDestroy(async (product) => {
  try {
    await deleteImage(product.id);  // Call the deleteImage function to delete the associated image for the product
  } catch (error) {
    console.error(`Failed to delete image for product ID ${product.id}:`, error); // Log any errors that occur during image deletion
  }
});

// Associate User with Products
User.hasMany(Product, {
  foreignKey: 'seller', // Define a one-to-many relationship where one User can have many Products
  onDelete: 'CASCADE', // If the User (Seller) is deleted, all associated Products will also be deleted
});

// Associate Orders with Product
Orders.belongsTo(Product, {
  foreignKey: 'productId', // Link the 'productId' field in Orders to the Product model
  onDelete: 'SET NULL', // If the Product is deleted, the productId in Orders will be set to NULL
});

// Associate Orders with User (Buyer)
Orders.belongsTo(User, {
  foreignKey: 'username',  // Link the 'username' field in Orders to the User model
  onDelete: 'SET NULL', // If the User is deleted, the username in Orders will be set to NULL
});

// Associate Comment with Product
Comment.belongsTo(Product, {
  foreignKey: 'productId', // Link the 'productId' field in Comment to the Product model
  onDelete: 'CASCADE',   // If the Product is deleted, all associated Comments will also be deleted
});

// Associate Comment with User
Comment.belongsTo(User, {
  foreignKey: 'username', // Link the 'username' field in Comment to the User model
  onDelete: 'SET NULL',  // If the User is deleted, the username in Comments will be set to NULL
});

// Export the associated models for use in other parts of the application
module.exports = { User, Product, Comment };
