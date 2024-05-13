require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT;
const { db } = require("./db/db");
const router = require("./routes/transactions");
// const { readdirSync, read } = require("fs");
const fs = require("fs");
const path = require("path");

// middlewares
app.use(express.json());
app.use(cors());


const routeFiles = fs.readdirSync(path.join(__dirname, "routes"));

routeFiles.forEach((routeFile) => {
  const routes = require(path.join(__dirname, "routes", routeFile));
  app.use("/api/user", routes);
  app.use("/api/auth", routes);
});

const server = async () => {
  await db();
  app.listen(port, () => {
    console.log("Listening to port:", port);
  });
};

server();
