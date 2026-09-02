const Order = require('../models/Order');
const zarinpal = require('../config/zarinpal');

exports.requestPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this order'
      });
    }

    if (order.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    const amount = order.totalAmount;
    const description = `Payment for order ${order._id}`;

    const response = await zarinpal.PaymentRequest({
      Amount: amount,
      CallbackURL: `${process.env.FRONTEND_URL}/payment/callback`,
      Description: description
    });

    if (response.status === 100) {
      order.paymentInfo.authority = response.authority;
      await order.save();

      return res.json({
        success: true,
        data: {
          authority: response.authority,
          url: response.url,
          orderId: order._id
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment request failed',
        data: response
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { authority, status } = req.body;

    const order = await Order.findOne({
      'paymentInfo.authority': authority
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (status === 'OK') {
      const response = await zarinpal.PaymentVerification({
        Amount: order.totalAmount,
        Authority: authority
      });

      if (response.status === 101 || response.status === 100) {
        order.status = 'paid';
        order.paymentInfo.refId = response.RefID;
        order.paymentInfo.paidAt = Date.now();
        await order.save();

        return res.json({
          success: true,
          data: {
            orderId: order._id,
            refId: response.RefID
          }
        });
      } else {
        order.status = 'cancelled';
        await order.save();

        return res.status(400).json({
          success: false,
          message: 'Payment verification failed'
        });
      }
    } else {
      order.status = 'cancelled';
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Payment was cancelled'
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.paymentCallback = async (req, res) => {
  try {
    const { Authority, Status } = req.query;

    if (Status === 'OK') {
      const order = await Order.findOne({
        'paymentInfo.authority': Authority
      });

      if (!order) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?message=Order not found`);
      }

      const response = await zarinpal.PaymentVerification({
        Amount: order.totalAmount,
        Authority: Authority
      });

      if (response.status === 101 || response.status === 100) {
        order.status = 'paid';
        order.paymentInfo.refId = response.RefID;
        order.paymentInfo.paidAt = Date.now();
        await order.save();

        return res.redirect(`${process.env.FRONTEND_URL}/payment/success?refId=${response.RefID}&orderId=${order._id}`);
      } else {
        order.status = 'cancelled';
        await order.save();

        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?message=Payment verification failed`);
      }
    } else {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?message=Payment cancelled`);
    }
  } catch (error) {
    return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?message=${error.message}`);
  }
};
