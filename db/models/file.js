"use strict";
const path = require("path");
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const file = sequelize.define("file", {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
      field: "id",
    },
    entity_type: {
      type: Sequelize.ENUM(
        'USER',
        'PRODUCTION_COMPANY',
        'VENUE',
        'SHOW',
        'EVENT',
        'REVIEW',
        'WATCHLIST',
        'WATCHLIST_ITEM',
      ),
        allowNull: false,
        field: "entity_type",
    },
    entity_id: {
        type: Sequelize.UUIDV4,
        allowNull: false,
        field: "entity_id",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "type",
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "filename",
    },
    filetype: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "filetype",
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "url",
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "path",
    },
    size: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      field: "size",
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
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
    tableName: "file",
    underscored: true,
    timestamps: false,
  });

  return file;
};