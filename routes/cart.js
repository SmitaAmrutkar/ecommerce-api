const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Add item to cart
router.post('/', (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  const sql = `INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)`;
  db.query(sql, [user_id, product_id, quantity], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Item added to cart', cartItemId: result.insertId });
  });
});

// Get all items for a user
router.get('/:user_id', (req, res) => {
  const { user_id } = req.params;
  const sql = `
    SELECT carts.id, products.name, products.price, carts.quantity
    FROM carts
    JOIN products ON carts.product_id = products.id
    WHERE carts.user_id = ?
  `;
  db.query(sql, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(rows);
  });
});

// Update quantity
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const sql = `UPDATE carts SET quantity = ? WHERE id = ?`;
  db.query(sql, [quantity, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: 'Cart updated' });
  });
});

// Delete item from cart
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM carts WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: 'Item removed from cart' });
  });
});

module.exports = router;
