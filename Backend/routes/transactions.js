import express from "express";
import fetchuser from "../middleswares/fetchUser.js";
import { addnewtransaction } from "../controllers/transactionlogs.js";
import multer from "multer";
import fs from "fs";
import path from "path";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Determine the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the path to the transactionProofs directory
const dir = path.join(__dirname, 'transactionProofs');

// Log the current directory and the transactionProofs directory path
// console.log('Current directory:', __dirname);
// console.log('Transaction proofs directory path:', dir);

// Ensure the directory exists
if (!fs.existsSync(dir)) {
  console.log('Directory does not exist. Creating directory...');
  fs.mkdirSync(dir, { recursive: true });
} else {
  console.log('Directory already exists.');
}

// Further check to confirm directory creation
fs.access(dir, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('Directory could not be accessed:', err.message);
  } else {
    console.log('Directory is accessible.');
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./transactionProofs");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });
const transactionrouter = express.Router();

// const {
//   addexpense,
//   getexpenses,
//   deleteexpense,
// } = require("../controllers/expense");
// const {
//   addincome,
//   getincomes,
//   deleteincome,
// } = require("../controllers/income");

// router.post("/addincome", fetchuser, addincome);
// router.get("/getincomes", fetchuser, getincomes);
// router.delete("/deleteincome/:id", deleteincome);
// router.post("/addexpense", addexpense);
// router.get("/getexpenses", getexpenses);
// router.delete("/delete/:id", deleteexpense);

transactionrouter.post(
  "/addnewtransaction",
  fetchuser,
  upload.single("file"),
  addnewtransaction
);
export default transactionrouter;
