"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const venue_user = sequelize.define("venue_user", {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
      field: "id",
    },
    user_id: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      field: "user_id",
    },
    venue_id: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      field: "venue_id",
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "role",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "type",
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
    tableName: "venue_user",
    underscored: true,
    timestamps: false,
  });

  return venue_user;
};