const Product = require('./product');
const User = require('./user');
const Comment = require('./comment');
const Orders = require('./order');
const { deleteImage } = require('../controllers/productController')

// Associate Product with User (Seller)
Product.belongsTo(User, {
  foreignKey: 'seller',  // This links the 'seller' field to 'User.username'
  onDelete: 'CASCADE',   // If the User is deleted, the associated Product will also be deleted
});

Product.afterDestroy(async (product) => {
  try {
    await deleteImage(product.id);  // Call the deleteImage function with the product ID
  } catch (error) {
    console.error(`Failed to delete image for product ID ${product.id}:`, error);
  }
});

User.hasMany(Product, {
  foreignKey: 'seller',
  onDelete: 'CASCADE', // If the User (Seller) is deleted, their products will be deleted
});

// Associate Orders with Product
Orders.belongsTo(Product, {
  foreignKey: 'productId',
  onDelete: 'SET NULL',
});

// Associate Orders with User (Buyer)
Orders.belongsTo(User, {
  foreignKey: 'username',  
  onDelete: 'SET NULL',
});

// Associate Comment with Product
Comment.belongsTo(Product, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',   // If the Product is deleted, associated Comments will be deleted
});

// Associate Comment with User
Comment.belongsTo(User, {
  foreignKey: 'username',
  onDelete: 'SET NULL',  // If the User is deleted, set userId in Comment to NULL
});

module.exports = { User, Product, Comment };
