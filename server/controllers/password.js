const User = require("../models/user");
const Forgotpassword = require("../models/forgotpassword");
const SendGrid = require("@sendgrid/mail");
const bycrypt = require("bcrypt");
const uuid = require("uuid");
require("dotenv").config();

exports.postForgotPassword = async (req, res, next) => {
  try {
    const emailApi = process.env.SENDGRID_API;
    const { email } = req.body;
    const user = await User.findAll({ where: { email: email } });
    if (user.length > 0) {
      /*
      uuid is sent to the db as request id and with the url of forgotpassword page route,
      this uuid gets attached to the api/uuid and received in the forgot password route backend then is used to authenticate if the link was not used 
      to update the password previously. if so then the "active" column should be false in the Forgotpassword table for the respective uuid
      */
      const id = uuid.v4();
      user[0].createForgotpassword({ id, active: true }).catch((err) => {
        throw new Error(err);
      });
      SendGrid.setApiKey(emailApi);
      const msg = {
        to: email,
        from: "prakashkumar.imw@gmail.com",
        subject: "Password reset",
        text: "Reset your password",
        html: `<a href="http://localhost:3000/password/resetpassword/${id}" >Click here to reset</a>`,
      };

      SendGrid.send(msg)
        .then(() => {
          return res.status(200).json({
            message:
              "A link to generate password has been sent to the provided mail id, Kindly check",
          });
        })
        .catch((error) => {
          console.log("Issue number 01 here: ", error);
        });
    } else {
      res.status(400).json({
        message:
          "We didn't find any associated account, please check the provided mail id!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: error, success: false });
  }
};

exports.postResetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const forgotPasswordUUIDValues = await Forgotpassword.findOne({
      where: { id: id },
    });
    if (forgotPasswordUUIDValues && forgotPasswordUUIDValues.active === true) {
      forgotPasswordUUIDValues.update({ active: false });
      const userId = forgotPasswordUUIDValues.userId;
      const user = await User.findOne({ where: { id: userId } });
      if (user) {
        const saltRounds = 10;
        bycrypt.hash(newPassword, saltRounds, async (err, hash) => {
          if (err) {
            throw new Error(err);
          } else {
            await user.update({ password: hash });
            return res.status(201).json({
              message: "Password changed successfully!",
              success: true,
            });
          }
        });
      }
    } else {
      return res.status(400).json({
        message:
          "UUID has been expired, please try resetting your password again!",
      });
    }
  } catch (error) {
    return res.status(400).json({ message: error, success: false });
  }
};
