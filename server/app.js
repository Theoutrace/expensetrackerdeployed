const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const helmet = require("helmet"); // for security as it adds some headers
const morgan = require("morgan"); // logs the details of requests, browser type used etc.
const fs = require("fs"); // we use this to manage files
const bodyParser = require("body-parser");
const sequelize = require("./utils/database");
const userRoutes = require("./routes/user");
const expenseRouters = require("./routes/expense");
const paymentRouters = require("./routes/payment");
const passwordRouter = require("./routes/password");
const UserModel = require("./models/user");
const ExpenseModel = require("./models/expense");
const Order = require("./models/order");
const ForgotPasswordModel = require("./models/forgotpassword");
const User = require("./models/user");
const DownloadURLModel = require("./models/downloadurl");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", userRoutes);
app.use("/expense", expenseRouters);
app.use("/payment", paymentRouters);
app.use("/password", passwordRouter);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream })); //used to log all the details

UserModel.hasMany(ExpenseModel);
ExpenseModel.belongsTo(UserModel);

UserModel.hasMany(Order);
Order.belongsTo(UserModel);

UserModel.hasMany(ForgotPasswordModel);
ForgotPasswordModel.belongsTo(UserModel);

UserModel.hasMany(DownloadURLModel);
DownloadURLModel.belongsTo(User);

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log("DB CONNECTED");
    });
  })
  .catch((error) => {
    console.log(error);
  });
