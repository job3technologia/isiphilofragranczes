const db = require('../config/db');

class Order {
  static async create({ customer_id, product_name, category, price }) {
    const sql = 'INSERT INTO orders (customer_id, product_name, category, price) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(sql, [customer_id, product_name, category, price]);
    return result.insertId;
  }

  static async findByUserId(customerId) {
    const [rows] = await db.execute('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC', [customerId]);
    return rows;
  }

  static async getStats(customerId) {
    const [rows] = await db.execute(`
      SELECT 
        COUNT(*) as total_orders, 
        SUM(price) as total_spent,
        (SELECT category FROM orders WHERE customer_id = ? GROUP BY category ORDER BY COUNT(*) DESC LIMIT 1) as top_category
      FROM orders 
      WHERE customer_id = ?
    `, [customerId, customer_id]);
    return rows[0];
  }

  static async getRecent(customerId, limit = 5) {
    const [rows] = await db.execute('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC LIMIT ?', [customerId, limit]);
    return rows;
  }
}

module.exports = Order;