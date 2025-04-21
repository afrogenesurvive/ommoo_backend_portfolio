"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const production_company_user = sequelize.define("production_company_user", {
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
    production_company_id: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      field: "production_company_id",
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "role",
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
    tableName: "production_company_user",
    underscored: true,
    timestamps: false,
  });

  return production_company_user;
};