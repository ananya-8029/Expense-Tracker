import express from "express";
import fetchuser from "../middleswares/fetchUser.js";
import isAdmin from "../middleswares/isAdmin.js";
import { getAllUsers, getAnalytics } from "../controllers/adminController.js";

const adminrouter = express.Router();

adminrouter.get("/users", fetchuser, isAdmin, getAllUsers);
adminrouter.get("/analytics", fetchuser, isAdmin, getAnalytics);

export default adminrouter;
