const express = require("express");
const authMiddlewere = require("../middleware/auth");

const router = express.Router();

const userController = require("../controllers/user");

//user
router.get("/", userController.getAllUsers);
router.post("/signup", userController.postSignup);
router.post("/login", userController.postLogin);

//for leaderboard
router.get(
  "/leaderboard",
  authMiddlewere.authentication,
  userController.getAllUsersDataForLeaderboard
);

module.exports = router;
