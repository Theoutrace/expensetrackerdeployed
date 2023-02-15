const Expenses = require("../models/expense");
const User = require("../models/user");
require("dotenv").config();
const S3services = require("../services/s3services");

exports.getExpenses = async (req, res, next) => {
  console.log(req.body);
  const page = req.params.page || 1;
  const ITEMS_PER_PAGE = +req.body.itemPerPage || 3;
  let totalItems;
  try {
    totalItems = await Expenses.count({ where: { userId: req.user.id } });
    const allExpenses = await req.user.getExpenses({
      offset: (page - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
    });
    const info = {
      currentPage: page,
      hasNextPage: totalItems > page * ITEMS_PER_PAGE,
      hasPreviousPage: page > 1,
      prevprevPage: +page - 2,
      previousPage: +page - 1,
      nextPage: +page + 1,
      nxtnxtPage: +page + 2,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    };
    return res.status(200).json({
      message: "Data Fetched Successfully",
      expenses: allExpenses,
      info,
    });
  } catch (error) {
    res.status(404).json({ message: "unable to load expenses" });
  }
};

//
exports.postExpense = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      const totalExpense = user.totalexpense || 0;
      const { amount, description, category } = req.body;
      await req.user.createExpense({ amount, description, category });
      await user.update({ totalexpense: totalExpense + +amount });
      return res
        .status(200)
        .json({ message: "Expense Added", expense: { ...req.body } });
    } else {
      throw new Error("Something Went Wrong in expense table");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      const expenseId = req.params.id;
      await req.user
        .getExpenses({ where: { id: expenseId } })
        .then(async (expense) => {
          let expenseToBeDeleted = expense[0];
          await user.update({
            totalexpense: user.totalexpense - expenseToBeDeleted.amount,
          });
          expenseToBeDeleted.destroy();
          res.status(200).json({ message: "Item deleted successfully!" });
        });
    }
  } catch (error) {
    res.status(500).json({ message: "failed to delete the Expense!" });
  }
};

// download Report
exports.getAllExpenseReport = async (req, res, next) => {
  try {
    const expenses = await req.user.getExpenses();
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `Expense${req.user.id}/${new Date()}.txt`;
    const fileURL = await S3services.uploadtoS3(stringifiedExpenses, filename);

    const downloadurlData = await req.user.createDownloadurl({
      fileName: filename,
      fileUrl: fileURL.Location,
    });
    res
      .status(200)
      .json({ fileURL: fileURL.Location, downloadurlData, success: true });
  } catch (error) {
    res.status(500).json({ fileURL: "", success: false, error: error });
  }
};

exports.downloadAllURL = async (req, res, next) => {
  try {
    let urls = await req.user.getDownloadurls();
    if (!urls) {
      res.status(404).json({ message: "no urls found!", success: false });
    }
    res.status(200).json({ urls, success: true });
  } catch (error) {
    res.status(500).json({ error });
  }
};
