const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModel = require("../models/user");

exports.authentication = async (req, res, next) => {
  const authToken = req.header("Authorization");
  const user = jwt.verify(authToken, process.env.JWT_SMOKING);
  UserModel.findByPk(user.userid).then((foundUser) => {
    req.user = foundUser;
    next();
  });
};
