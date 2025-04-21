"use strict";
const fs = require("fs");
const path = require("path");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sqlDirPath = path.join(__dirname, "../sql");
    const sqlFiles = fs.readdirSync(sqlDirPath);

    for (const file of sqlFiles) {
      const sqlFilePath = path.join(sqlDirPath, file);
      const sql = fs.readFileSync(sqlFilePath, "utf8");
      await queryInterface.sequelize.query(sql);
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("contact");
    await queryInterface.dropTable("event");
    await queryInterface.dropTable("user");
    await queryInterface.dropTable("rating");
    await queryInterface.dropTable("review");
    await queryInterface.dropTable("venue");
    await queryInterface.dropTable("venue_user");
    await queryInterface.dropTable("venue_event");
    await queryInterface.dropTable("venue_show");
    await queryInterface.dropTable("show");
    await queryInterface.dropTable("show_user");
    await queryInterface.dropTable("production_company_user");
    await queryInterface.dropTable("production_company");
    await queryInterface.dropTable("tag");
    await queryInterface.dropTable("like");
    await queryInterface.dropTable("watchlist");
    await queryInterface.dropTable("watchlist_item");
    await queryInterface.dropTable("activity");
    await queryInterface.dropTable("file");
  },
};