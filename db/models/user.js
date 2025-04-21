"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define("user", {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
      field: "id",
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "username",
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name",
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "middle_name",
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "full_name",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "type",
    },
    subtype: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "subtype",
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "dob",
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "age",
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'gender',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'email',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password",
    },
    system_id: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "system_id",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "notes",
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "role",
    },
    logged_in: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "logged_in",
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "verified",
    },
    verification_code: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "verification_code",
    },
    verification_type: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "verification_type",
    },
    reset_code: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "reset_code",
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
    tableName: "user",
    underscored: true,
    timestamps: false,
  });

  return user;
};