const Order = require("../models/order");
const RazorPay = require("razorpay");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = (id, email, ispremiumuser) => {
  return jwt.sign(
    { userid: id, email: email, ispremiumuser: ispremiumuser },
    process.env.JWT_SMOKING
  );
};

exports.postPayment = async (req, res, next) => {
  try {
    let instance = new RazorPay({
      key_id: process.env.key_id,
      key_secret: process.env.key_secret,
    });
    let options = {
      amount: 100000,
      currency: "INR",
      receipt: "ABC",
    };

    instance.orders.create(options, (err, order) => {
      if (err) {
        throw new Error(err);
      } else {
        req.user
          .createOrder({ orderId: order.id, status: "PENDING" })
          .then(() => {
            return res.status(201).json({ order, key_id: instance.key_id });
          })
          .catch((err) => {
            throw new Error(err);
          });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong!" });
  }
};

exports.postUpdateTransactionStatus = async (req, res, next) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body.response;

    const order = await Order.findAll({
      where: { orderId: razorpay_order_id },
    });

    if (order.length > 0) {
      const targetOrder = order[0];
      const promise1 = targetOrder.update({
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "SUCCESS",
      });
      const promise2 = req.user.update({ ispremiumuser: true });
      Promise.all([promise1, promise2])
        .then(() => {
          return res.status(200).json({
            message: "Premium subscribed!",
            token: generateAccessToken(req.user.id, req.user.email, true),
          });
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  } catch (error) {
    res.status(403).json({ error: error, message: "Something went wrong!" });
  }
};

exports.postUpdateTransactionFailedStatue = async (req, res, next) => {
  try {
    console.log(req.body);
    const orderId = req.body.options.order_id;
    const order = await Order.findAll({ where: { orderId: orderId } });
    if (order.length > 0) {
      const orderToBeUpdated = order[0];
      await orderToBeUpdated.update({ status: " FAILED" });
      return res.status(403).json({ message: "Transaction Failed" });
    }
  } catch (error) {
    res.status(401).json({ message: "Something went wrong!" });
  }
};
