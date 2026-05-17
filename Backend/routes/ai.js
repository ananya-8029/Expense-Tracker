import express from "express";
import fetchuser from "../middleswares/fetchUser.js";
import { askAI } from "../controllers/aiController.js";

const airouter = express.Router();

airouter.post("/ask", fetchuser, askAI);

export default airouter;
