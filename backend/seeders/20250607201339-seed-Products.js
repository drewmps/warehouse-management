"use strict";
const fs = require("fs").promises;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const rows = JSON.parse(
      await fs.readFile("./data/products.json", "utf8")
    ).map((row) => {
      delete row.id;
      row.createdAt = new Date();
      row.updatedAt = new Date();
      return row;
    });
    await queryInterface.bulkInsert("Products", rows);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
