"use strict";
const { hashPassword } = require("../helpers/bcrypt");
const fs = require("fs").promises;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const rows = JSON.parse(
      await fs.readFile("./data/employees.json", "utf8")
    ).map((row) => {
      delete row.id;
      row.password = hashPassword(row.password);
      row.createdAt = new Date();
      row.updatedAt = new Date();
      return row;
    });
    await queryInterface.bulkInsert("Employees", rows);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Employees", null, {});
  },
};
