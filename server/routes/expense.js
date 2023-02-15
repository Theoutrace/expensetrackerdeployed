const express = require("express");
const userAuthMiddlewere = require("../middleware/auth");
const expenseController = require("../controllers/expense");

const router = express.Router();

router.post(
  "/:page",
  userAuthMiddlewere.authentication,
  expenseController.getExpenses
);

router.delete(
  "/:id",
  userAuthMiddlewere.authentication,
  expenseController.deleteExpense
);

router.post(
  "/add-expense",
  userAuthMiddlewere.authentication,
  expenseController.postExpense
);

//download-expenses
router.get(
  "/download-expenses",
  userAuthMiddlewere.authentication,
  expenseController.getAllExpenseReport
);

router.get(
  "/download-expenses/allurl",
  userAuthMiddlewere.authentication,
  expenseController.downloadAllURL
);

module.exports = router;
