import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db/db.js";
import userrouter from "./routes/auth.js";
import transactionrouter from "./routes/transactions.js";
import adminrouter from "./routes/admin.js";
import airouter from "./routes/ai.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", userrouter);
app.use("/api/transactions", transactionrouter);
app.use("/api/admin", adminrouter);
app.use("/api/ai", airouter);

const server = async () => {
  await db();
  app.listen(port, () => {
    console.log("Listening to port:", port);
  });
};

server();
