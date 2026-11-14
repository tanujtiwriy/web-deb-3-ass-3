const Product = require('../models/Product');

// CREATE
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) { next(err); }
};

// GET ALL (filter + sort + pagination)
exports.getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, sort } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) filter.name = new RegExp(search, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortBy = sort ? sort.split(',').join(' ') : '-createdAt';

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      count: products.length,
      products
    });
  } catch (err) { next(err); }
};

// GET ONE
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) { next(err); }
};

// UPDATE
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) { next(err); }
};

// DELETE
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted', id: product.id });
  } catch (err) { next(err); }
};

// STOCK ADJUST (restock / sale)
exports.adjustStock = async (req, res, next) => {
  try {
    const { change } = req.body;
    if (typeof change !== 'number' || change === 0) {
      return res.status(400).json({ error: '"change" must be a non-zero number' });
    }

    const filter = { _id: req.params.id };
    if (change < 0) filter.quantity = { $gte: -change };

    const product = await Product.findOneAndUpdate(
      filter,
      { $inc: { quantity: change } },
      { new: true }
    );

    if (!product) {
      const exists = await Product.exists({ _id: req.params.id });
      if (!exists) return res.status(404).json({ error: 'Product not found' });
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    res.json({ message: 'Stock updated', product });
  } catch (err) { next(err); }
};

// LOW STOCK REPORT
exports.getLowStock = async (req, res, next) => {
  try {
    const lowStockItems = await Product.find({
      $expr: { $lte: ['$quantity', '$reorderLevel'] }
    });
    res.json({ count: lowStockItems.length, lowStockItems });
  } catch (err) { next(err); }
};

// CATEGORY SUMMARY (aggregation)
exports.getSummary = async (req, res, next) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalStockValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { totalStockValue: -1 } }
    ]);
    res.json({ categories: summary.length, summary });
  } catch (err) { next(err); }
};