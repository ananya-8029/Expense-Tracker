require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT;
const { db } = require("./db/db");
const router = require("./routes/transactions");
const { readdirSync, read } = require("fs");

// middlewares
app.use(express.json());
app.use(cors());

// routes
readdirSync("./routes").map((route) => {
  app.use("/api/user", require("./routes/" + route));
});

const server = async () => {
  await db();
  app.listen(port, () => {
    console.log("Listening to port:", port);
  });
};

server();
