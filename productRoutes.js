const router = require('express').Router();
const c = require('../controllers/productController');

// Static routes pehle, /:id baad mein
router.get('/low-stock', c.getLowStock);
router.get('/summary', c.getSummary);

router.post('/', c.createProduct);
router.get('/', c.getProducts);

router.get('/:id', c.getProductById);
router.put('/:id', c.updateProduct);
router.delete('/:id', c.deleteProduct);
router.patch('/:id/stock', c.adjustStock);

module.exports = router;