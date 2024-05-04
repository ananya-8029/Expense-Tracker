const mongoose = require("mongoose");
require("dotenv").config();
const db = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database failed to connect", error);
  }
};

module.exports = { db };

