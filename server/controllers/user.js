const User = require("../models/user");
const Expense = require("../models/expense");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
require("dotenv").config();

function generateAccessToken(id, email, ispremiumuser) {
  return jwt.sign(
    { userid: id, email: email, ispremiumuser: ispremiumuser },
    process.env.JWT_SMOKING
  );
}

//post for signup
exports.postSignup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = User.findAll({ where: { email } });
    if (user.length > 0) {
      res.status(550).json({ message: "User already Exists!" });
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      await User.create({ name, email, password: hash });
      const userInResponse = await User.findAll({ where: { email: email } });
      return res.status(201).json({
        message: { text: "User Created" },
        user: userInResponse[0],
        token: generateAccessToken(
          userInResponse[0].id,
          email,
          userInResponse[0].ispremiumuser
        ),
      });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  res.json({ message: "get is working!" });
};

// post for login
exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userEmail = email;
    const user = await User.findAll({ where: { email: userEmail } });
    if (user.length == 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const existingUser = user[0];
    const isMatched = await bcrypt.compare(password, existingUser.password);
    if (isMatched) {
      return res.status(200).json({
        message: "User login sucessful",
        user: existingUser,
        token: generateAccessToken(
          existingUser.id,
          existingUser.email,
          existingUser.ispremiumuser
        ),
      });
    } else {
      return res.status(401).json({ message: "User is not authorised!" });
    }
  } catch (error) {
    res.status(500).json({ message: error, success: false });
  }
};

//get for leaderboard
exports.getAllUsersDataForLeaderboard = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.ispremiumuser) {
      let leaderboard = await User.findAll({
        attributes: ["id", "name", "email", "totalexpense"],
        order: [["totalexpense", "DESC"]],
      });

      return res.status(200).json({ success: true, data: leaderboard });
    } else {
      res.status(401).json({ message: "User is not premium account holder!" });
    }
  } catch (error) {
    res.status(500).json({ success: false, data: error });
  }
};
