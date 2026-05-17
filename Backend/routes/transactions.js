import express from "express";
import fetchuser from "../middleswares/fetchUser.js";
import { addnewtransaction, gettransactions, deletetransaction } from "../controllers/transactionlogs.js";
import { addincome, getincomes, deleteincome, updateincome } from "../controllers/income.js";
import { addexpense, getexpenses, deleteexpense, updateexpense } from "../controllers/expense.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dir = path.join(__dirname, "../transactionProofs");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
const transactionrouter = express.Router();

// Income routes
transactionrouter.post("/addincome", fetchuser, addincome);
transactionrouter.get("/getincomes", fetchuser, getincomes);
transactionrouter.delete("/deleteincome/:id", fetchuser, deleteincome);
transactionrouter.put("/updateincome/:id", fetchuser, updateincome);

// Expense routes
transactionrouter.post("/addexpense", fetchuser, addexpense);
transactionrouter.get("/getexpenses", fetchuser, getexpenses);
transactionrouter.delete("/deleteexpense/:id", fetchuser, deleteexpense);
transactionrouter.put("/updateexpense/:id", fetchuser, updateexpense);

// Transaction log routes
transactionrouter.post("/addnewtransaction", fetchuser, upload.single("file"), addnewtransaction);
transactionrouter.get("/gettransactions", fetchuser, gettransactions);
transactionrouter.delete("/deletetransaction/:id", fetchuser, deletetransaction);

export default transactionrouter;
