"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const show_user = sequelize.define("show_user", {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
      field: "id",
    },
    show_id: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      field: "show_id",
    },
    user_id: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      field: "user_id",
    },
    attendance_type: {
      type: Sequelize.ENUM(
        'VENUE',
        'PRODUCTION',
        'CAST',
        'CREW',
        'CRITIC',
        'AUDIENCE',
      ),
      allowNull: false,
      field: "attendance_type",
    },
    venue_show_id: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      field: "venue_show_id",
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
    tableName: "show_user",
    underscored: true,
    timestamps: false,
  });

  return show_user;
};