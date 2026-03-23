const Order = require('../models/Order');

exports.createOrder = async (req, res, next) => {
  const { product_name, price, category } = req.body;
  try {
    const orderId = await Order.create({ user_id: req.user.id, product_name, price, category });
    res.status(201).json({ msg: 'Order placed successfully', orderId });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.findByUserId(req.user.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};