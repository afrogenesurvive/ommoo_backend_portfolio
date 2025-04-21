"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const production_company = sequelize.define("production_company", {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
      field: "id",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "name",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "description",
    },
    founded: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "founded",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "type",
    },
    display_image_url: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "display_image_url",
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
    tableName: "production_company",
    underscored: true,
    timestamps: false,
  });

  return production_company;
};