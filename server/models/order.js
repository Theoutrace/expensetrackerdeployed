const Sequelize = require("sequelize"); //for types
const sequelize = require("../utils/database");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  paymentId: Sequelize.STRING,
  orderId: Sequelize.STRING,
  signature: Sequelize.STRING,
  status: Sequelize.STRING,
});

module.exports = Order;
