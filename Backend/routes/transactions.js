import express from "express";
import fetchuser from "../middleswares/fetchUser.js";
import { addnewtransaction } from "../controllers/transactionlogs.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
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

transactionrouter.post("/addnewtransaction", fetchuser,upload.single('Attachedfile'), addnewtransaction);
export default transactionrouter;
