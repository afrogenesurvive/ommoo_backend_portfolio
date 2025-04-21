"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const watchlist_item = sequelize.define("watchlist_item", {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
      field: "id",
    },
    watchlist_id: {
        type: Sequelize.UUIDV4,
        allowNull: false,
        field: "watchlist_id",
    },
    show_id: {
        type: Sequelize.UUIDV4,
        allowNull: false,
        field: "show_id",
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "position",
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "private",
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "create_time",
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "update_time",
    },
    created_by: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      field: "created_by",
    },
    updated_by: {
      type: Sequelize.UUIDV4,
      allowNull: true,
      field: "updated_by",
    },
    is_deleted: {
      type: Sequelize.CHAR(1),
      allowNull: false,
      field: 'is_deleted'
    },
  }, {
    freezeTableName: true,
    tableName: "watchlist_item",
    underscored: true,
    timestamps: false,
  });

  return watchlist_item;
};