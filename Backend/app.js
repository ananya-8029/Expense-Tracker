require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT;
const { db } = require("./db/db");

// middlewares
app.use(express.json());
app.use(cors());

const server = async () => {
  await db();
  app.listen(port, () => {
    console.log("Listening to port:", port);
  });
};

server();
