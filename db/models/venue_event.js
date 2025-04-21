"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const venue_event = sequelize.define("venue_event", {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
      field: "id",
    },
    venue_id: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      field: "venue_id",
    },
    event_id: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      field: "event_id",
    },
    show_id: {
      type: Sequelize.UUIDV4,
      allowNull: true,
      field: "show_id",
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "active",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "type",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "name",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "description",
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
    tableName: "venue_event",
    underscored: true,
    timestamps: false,
  });

  return venue_event;
};