const express = require('express');
const router = express.Router();
const db = require('../config/db');  // MySQL connection

// Route to place an order
router.post('/place', async (req, res) => {
  try {
    const { user_id, products } = req.body;

    // Validate the request body
    if (!user_id || !products || products.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Start a MySQL transaction
    await db.promise().beginTransaction();

    // Insert order into the 'orders' table
    const [orderResult] = await db.promise().query(
      'INSERT INTO orders (user_id, status, order_date) VALUES (?, ?, ?)',
      [user_id, 'pending', new Date()]
    );

    const orderId = orderResult.insertId;

    // Insert each product into the 'order_items' table
    for (const product of products) {
      const { product_id, quantity } = product;

      await db.promise().query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
        [orderId, product_id, quantity]
      );
    }

    // Commit the transaction
    await db.promise().commit();

    // Optionally, clear the cart after placing the order
    await db.promise().query('DELETE FROM carts WHERE user_id = ?', [user_id]);

    // Respond with success message
    res.status(201).json({ message: 'Order placed successfully', order_id: orderId });

  } catch (err) {
    // Rollback the transaction in case of error
    await db.promise().rollback();
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

module.exports = router;
