"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const user_permission = sequelize.define("user_permission", {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
      field: "id",
    },
    name: {
      type: Sequelize.ENUM(
        'ADD_SHOW',
        'EDIT_SHOW',
        'ADD_USER',
        'EDIT_USER',
        'ADD_VENUE',
        'EDIT_VENUE',
        'ADD_REVIEW',
        'EDIT_REVIEW',
        'ADD_RATING',
        'EDIT_RATING',
        'ADD_EVENT',
        'EDIT_EVENT',
        'ADD_PRODUCTION_COMPANY',
        'EDIT_PRODUCTION_COMPANY',
      ),
      allowNull: false,
      field: "name",
    },
    user_id: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      field: "user_id",
    },
    entity_id: {
      type: Sequelize.UUIDV4,
      allowNull: true,
      field: "entity_id",
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
    tableName: "user_permission",
    underscored: true,
    timestamps: false,
  });

  return user_permission;
};