const Product = require('../models/productModel');

exports.getAllProducts = (req, res) => {
  Product.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getProductById = (req, res) => {
  const id = req.params.id;
  Product.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(results[0]);
  });
};

exports.createProduct = (req, res) => {
  const product = req.body;
  Product.create(product, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, ...product });
  });
};

exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const product = req.body;
  Product.update(id, product, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Product updated' });
  });
};

exports.deleteProduct = (req, res) => {
  const id = req.params.id;
  Product.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Product deleted' });
  });
};
