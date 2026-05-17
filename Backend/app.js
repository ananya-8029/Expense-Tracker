import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import db from "./db/db.js";
import userrouter from "./routes/auth.js";
import transactionrouter from "./routes/transactions.js";
import adminrouter from "./routes/admin.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

// middlewares
app.use(express.json());
app.use(cors());

app.use("/api/auth", userrouter);
app.use("/api/transactions", transactionrouter);
app.use("/api/admin", adminrouter);

const server = async () => {
  await db();
  app.listen(port, () => {
    console.log("Listening to port:", port);
  });
};

server();
