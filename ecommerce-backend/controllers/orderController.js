const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: { model: Product } });
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error getting the orders" });
  }
};

exports.getShopperOrders = async (req, res) => {
  try {
    const { username } = req.user;
    const orders = await Order.findAll({ where: { username }, include: { model: Product } });
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error getting the orders" });
  }
};

exports.getSellerOrders = async (req, res) => {
  try {
    const { username } = req.user;
    const orders = await Order.findAll({
      include: {
        model: Product,
        where: { seller: username },
      },
    });

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error getting the orders" });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.user;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Product,
          include: {
            model: User,
          },
        },
        {
          model: User,
        },
      ],
    });

    if (!order) return res.status(404).json({ message: "Order not Found" });
    if (
      order.username === username ||
      order.dataValues.Product?.dataValues.seller === username ||
      req.user.role === "admin"
    ) {
      res.json(order);
    } else {
      res.status(403).json({ message: "Access Denied" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error getting the order" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.user;

    const order = await Order.findByPk(id, {
      include: {
        model: Product,
      },
    });

    if (order.username === username) {
      if (order.status === "Delivered")
        return res.status(409).json({ message: "Order is already delivered!" });
      else if (order.status.startsWith("Cancelled"))
        return res.status(409).json({ message: "Order is already cancelled!" });
      else order.set("status", "Cancelled by Shopper");
    } else if (order.dataValues.Product.dataValues.seller === username) {
      if (order.status !== "Placed")
        return res
          .status(409)
          .json({ message: 'You have only cancel the orders with "Placed" status!' });
      else order.set("status", "Cancelled by Seller");
    } else
      return res
        .json(403)
        .json({ message: "Access Denied, only the Seller or Shopper can cancel the order!" });

    order.save();
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error cancelling the order" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Could not find the order" });

    if (order.status.startsWith("Cancelled"))
      return res.status(409).json({ message: "Order is already cancelled!" });
    
    if (status.startsWith("Cancelled"))
      return res.status(400).json({ message: "Invalid Body" });

    order.set({status})
    order.save();
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error cancelling the order" });
  }
};