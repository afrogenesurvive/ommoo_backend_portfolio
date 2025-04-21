"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("password", 10);

    return queryInterface.bulkInsert(
      "user",
      [
        {
          id: uuidv4(),
          username: "johndoe",
          first_name: "John",
          last_name: "Doe",
          middle_name: "A",
          full_name: "John A Doe",
          type: "admin",
          subtype: "superadmin",
          dob: new Date("1990-01-01"),
          gender: "Male",
          age: 31,
          password: hashedPassword,
          system_id: "SYS001",
          notes: "Sample note for John Doe",
          role: "admin",
          logged_in: false,
          verified: true,
          verification_code: "123456",
          verification_type: "email",
          reset_code: "654321",
          email: "john.doe@example.com",
          create_time: new Date(),
          update_time: new Date(),
          created_by: uuidv4(),
          updated_by: null,
          is_deleted: "N",
        },
        {
          id: uuidv4(),
          username: "janesmith",
          first_name: "Jane",
          last_name: "Smith",
          middle_name: "B",
          full_name: "Jane B Smith",
          type: "user",
          subtype: "regular",
          dob: new Date("1995-05-15"),
          gender: "Female",
          age: 26,
          password: hashedPassword,
          system_id: "SYS002",
          notes: "Sample note for Jane Smith",
          role: "user",
          logged_in: false,
          verified: true,
          verification_code: "654321",
          verification_type: "email",
          reset_code: "123456",
          email: "jane.smith@example.com",
          create_time: new Date(),
          update_time: new Date(),
          created_by: uuidv4(),
          updated_by: null,
          is_deleted: "N",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("user", null, {});
  },
};