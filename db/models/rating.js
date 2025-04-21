"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const rating = sequelize.define("rating", {
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
    show_id: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      field: "show_id",
    },
    venue_id: {
      type: Sequelize.UUIDV4,
      allowNull: true,
        field: "venue_id",
    },
    event_id: {
      type: Sequelize.UUIDV4,
      allowNull: true,
      field: "event_id",
    },
    review_id: {
      type: Sequelize.UUIDV4,
      allowNull: true,
      field: "review_id",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "type",
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "value",
    },
    held: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "held",
    },
    show_user_id: {
      type: Sequelize.UUIDV4,
      allowNull: true,
      field: "show_user_id",
    },
    venue_show_id: {
      type: Sequelize.UUIDV4,
      allowNull: true,
      field: "venue_show_id",
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
    tableName: "rating",
    underscored: true,
    timestamps: false,
  });

  return rating;
};