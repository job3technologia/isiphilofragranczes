const User = require('../models/User');
const Order = require('../models/Order');

exports.getDashboardData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const stats = await Order.getStats(req.user.id);
    const recentActivity = await Order.getRecent(req.user.id);

    res.json({
      user,
      stats: {
        total_orders: stats.total_orders || 0,
        total_spent: parseFloat(stats.total_spent || 0).toFixed(2),
        top_category: stats.top_category || 'N/A'
      },
      recentActivity
    });
  } catch (err) {
    next(err);
  }
};