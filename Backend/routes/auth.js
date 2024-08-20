import fetchuser from "../middleswares/fetchUser.js";
import { register, login, getUser } from "../controllers/authUser.js";
import express from "express";

const userrouter = express.Router();

userrouter.post("/register", register);
userrouter.post("/login", login);
userrouter.get("/getUser", fetchuser, getUser);

export default userrouter;
