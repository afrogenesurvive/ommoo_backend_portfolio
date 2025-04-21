"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const show = sequelize.define("show", {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
      field: "id",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "title",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "description",
    },
    production_company_id: {
      type: Sequelize.UUIDV4,
      allowNull: true,
      field: "production_company_id",
    },
    age_recommendation: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "age_recommendation",
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "duration",
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "start_date",
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "end_date",
    },
    type: {
      type: Sequelize.ENUM(
        'THEATRE',
        'DANCE',
        'PERFORMANCE_ART',
        'MUSIC',
      ),
      allowNull: true,
      field: "type",
    },
    average_rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "average_rating",
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
    tableName: "show",
    underscored: true,
    timestamps: false,
  });

  return show;
};