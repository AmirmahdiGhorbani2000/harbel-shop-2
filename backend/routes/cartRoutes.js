const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update/:id', protect, updateCartItem);
router.delete('/remove/:id', protect, removeCartItem);
router.delete('/clear', protect, clearCart);

module.exports = router;
