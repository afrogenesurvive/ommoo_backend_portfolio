"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const contact = sequelize.define("contact", {
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
      ),
      allowNull: false,
      field: "entity_type",
    },
    entity_id: {
      type: Sequelize.UUIDV4,
      allowNull: false,
      field: "entity_id",
    },
    primary: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "primary",
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "phone",
    },
    phone2: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "phone2",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "email",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "address",
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "address2",
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "state",
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "city",
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "country",
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "postal_code",
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
    },
    updated_by: {
      type: Sequelize.UUIDV4,
      allowNull: true,
    },
    is_deleted: {
      type: Sequelize.CHAR(1),
      allowNull: false,
      field: 'is_deleted'
    },
  }, {
    freezeTableName: true,
    tableName: "contact",
    underscored: true,
    timestamps: false,
  });

  return contact;
};