const express = require("express");

const router = express.Router();
const orderControllers = require("../controllers/payment");
const auth = require("../middleware/auth");

router.post("/buypremium", auth.authentication, orderControllers.postPayment);
router.post(
  "/update-transaction-status",
  auth.authentication,
  orderControllers.postUpdateTransactionStatus
);
router.post(
  "/update-transaction-status/failed",
  auth.authentication,
  orderControllers.postUpdateTransactionFailedStatue
);

module.exports = router;
