"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Order .belongsTo(Foo, {
      //   foreignKey: {
      //     name: 'myFooId',
      //   },

      Order.belongsTo(models.User, {
        foreignKey: {
          name: "user_id",
          as: "user",
        },
      });
      Order.belongsTo(models.Plant, {
        foreignKey: {
          name: "product_id",
          as: "product",
        },
      });
    }
  }
  Order.init(
    {
      order_number: { type: DataTypes.STRING, unique: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },

      product_id: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        defaultValue: "pending",
        values: ["pending", "processing", "completed"],
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );
  return Order;
};
