const express = require('express');
const router = express.Router();
const {
  requestPayment,
  verifyPayment,
  paymentCallback
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/request', protect, requestPayment);
router.post('/verify', protect, verifyPayment);
router.get('/callback', paymentCallback);

module.exports = router;
