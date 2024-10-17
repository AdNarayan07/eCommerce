// Import necessary models
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

// Get all orders, including associated products
exports.getOrders = async (req, res) => {
  try {
    // Fetch all orders with their associated products
    const orders = await Order.findAll({ include: { model: Product } });
    res.json(orders); // Send the orders as a JSON response
  } catch (err) {
    console.log(err); // Log any errors that occur
    res.status(500).json({ message: "Error getting the orders" }); // Send error response
  }
};

// Get orders for the currently authenticated shopper
exports.getShopperOrders = async (req, res) => {
  try {
    const { username } = req.user; // Get the username from the authenticated user
    // Fetch orders for the specific shopper, including associated products
    const orders = await Order.findAll({ where: { username }, include: { model: Product } });
    res.json(orders); // Send the orders as a JSON response
  } catch (err) {
    console.log(err); // Log any errors that occur
    res.status(500).json({ message: "Error getting the orders" }); // Send error response
  }
};

// Get orders for the currently authenticated seller
exports.getSellerOrders = async (req, res) => {
  try {
    const { username } = req.user; // Get the username from the authenticated user
    // Fetch orders that belong to the seller, including associated products
    const orders = await Order.findAll({
      include: {
        model: Product,
        where: { seller: username }, // Filter products by seller username
      },
    });

    res.json(orders); // Send the orders as a JSON response
  } catch (err) {
    console.log(err); // Log any errors that occur
    res.status(500).json({ message: "Error getting the orders" }); // Send error response
  }
};

// Get a specific order by ID
exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params; // Get the order ID from the request parameters
    const { username } = req.user; // Get the username from the authenticated user

    // Fetch the order by ID, including associated product and user information
    const order = await Order.findByPk(id, {
      include: [
        {
          model: Product,
          include: {
            model: User, // Include user data associated with the product
          },
        },
        {
          model: User, // Include user data associated with the order
        },
      ],
    });

    // Check if the order exists
    if (!order) return res.status(404).json({ message: "Order not Found" });

    // Check if the user has permission to view the order
    if (
      order.username === username || // Shopper is the owner of the order
      order.dataValues.Product?.dataValues.seller === username || // Seller is the product owner
      req.user.role === "admin" // Admin has access
    ) {
      res.json(order); // Send the order as a JSON response
    } else {
      res.status(403).json({ message: "Access Denied" }); // Deny access if not authorized
    }
  } catch (err) {
    console.log(err); // Log any errors that occur
    res.status(500).json({ message: "Error getting the order" }); // Send error response
  }
};

// Cancel a specific order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params; // Get the order ID from the request parameters
    const { username } = req.user; // Get the username from the authenticated user

    // Fetch the order by ID, including associated product information
    const order = await Order.findByPk(id, {
      include: {
        model: Product,
      },
    });

    // Check if the user is the shopper and can cancel the order
    if (order.username === username) {
      if (order.status === "Delivered") {
        return res.status(409).json({ message: "Order is already delivered!" });
      } else if (order.status.startsWith("Cancelled")) {
        return res.status(409).json({ message: "Order is already cancelled!" });
      } else {
        order.set("status", "Cancelled by Shopper"); // Set the order status to cancelled by shopper
      }
    } else if (order.dataValues.Product.dataValues.seller === username) { // Check if the user is the seller
      if (order.status !== "Placed") {
        return res
          .status(409)
          .json({ message: 'You can only cancel orders with "Placed" status!' });
      } else {
        order.set("status", "Cancelled by Seller"); // Set the order status to cancelled by seller
      }
    } else {
      return res
        .status(403)
        .json({ message: "Access Denied, only the Seller or Shopper can cancel the order!" });
    }

    await order.save(); // Save the updated order
    res.json(order); // Send the updated order as a JSON response
  } catch (err) {
    console.log(err); // Log any errors that occur
    res.status(500).json({ message: "Error cancelling the order" }); // Send error response
  }
};

// Update the status of a specific order
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params; // Get the order ID from the request parameters
    const { status } = req.body; // Get the new status from the request body

    // Fetch the order by ID
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Could not find the order" }); // Check if the order exists

    if (order.status.startsWith("Cancelled")) {
      return res.status(409).json({ message: "Order is already cancelled!" });
    }
    
    if (status.startsWith("Cancelled")) {
      return res.status(400).json({ message: "Invalid Body" }); // Prevent setting an invalid status
    }

    order.set({ status }); // Update the order status
    await order.save(); // Save the updated order
    res.json(order); // Send the updated order as a JSON response
  } catch (err) {
    console.log(err); // Log any errors that occur
    res.status(500).json({ message: "Error updating the order status" }); // Send error response
  }
};
