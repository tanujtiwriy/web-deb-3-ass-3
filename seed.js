require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const data = [
  { name: 'Study Table', sku: 'FURN-TB-812', category: 'Furniture', price: 3999, quantity: 2, reorderLevel: 4, supplier: 'IKEA India' },
  { name: 'Office Chair', sku: 'FURN-CH-813', category: 'Furniture', price: 6499, quantity: 9, reorderLevel: 4, supplier: 'Godrej' },
  { name: 'Wireless Mouse', sku: 'ELEC-MS-101', category: 'Electronics', price: 799, quantity: 30, reorderLevel: 10, supplier: 'Logitech' },
  { name: 'Laptop 15 inch', sku: 'ELEC-LP-202', category: 'Electronics', price: 52000, quantity: 3, reorderLevel: 5, supplier: 'Dell' },
  { name: 'Bluetooth Speaker', sku: 'ELEC-SP-303', category: 'Electronics', price: 1999, quantity: 40, reorderLevel: 8, supplier: 'boAt' },
  { name: 'Keyboard', sku: 'ELEC-KB-304', category: 'Electronics', price: 1200, quantity: 23, reorderLevel: 10, supplier: 'Logitech' },
  { name: 'Cotton T-Shirt', sku: 'APRL-TS-401', category: 'Apparel', price: 499, quantity: 50, reorderLevel: 15, supplier: 'Raymond' },
  { name: 'Denim Jacket', sku: 'APRL-JK-402', category: 'Apparel', price: 2299, quantity: 28, reorderLevel: 10, supplier: 'Levis' },
  { name: 'A4 Notebook', sku: 'STNY-NB-714', category: 'Stationery', price: 90, quantity: 6, reorderLevel: 25, supplier: 'Classmate' },
  { name: 'Stapler', sku: 'STNY-ST-715', category: 'Stationery', price: 150, quantity: 18, reorderLevel: 10, supplier: 'Kangaro' },
  { name: 'Basmati Rice 5kg', sku: 'GROC-RC-901', category: 'Grocery', price: 650, quantity: 5, reorderLevel: 12, supplier: 'India Gate' },
  { name: 'Olive Oil 1L', sku: 'GROC-OL-902', category: 'Grocery', price: 899, quantity: 20, reorderLevel: 8, supplier: 'Figaro' }
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(data);
  console.log('Seeded', data.length, 'products');
  process.exit(0);
})();