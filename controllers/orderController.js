const express = require('express');
const router = express.Router();
const db = require('../config/db'); // your mysql connection

router.post('/place', async (req, res) => {
  const { user_id, products } = req.body;

  if (!user_id || !products || !Array.isArray(products)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    // Start transaction
    await db.promise().beginTransaction();

    // Insert into orders
    const [orderResult] = await db.promise().query(
      'INSERT INTO orders (user_id) VALUES (?)',
      [user_id]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of products) {
      const { product_id, quantity } = item;

      await db.promise().query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
        [orderId, product_id, quantity]
      );
    }

    // Commit transaction
    await db.promise().commit();

    res.status(201).json({ message: 'Order placed successfully', order_id: orderId });
  } catch (err) {
    await db.promise().rollback();
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

module.exports = router;
