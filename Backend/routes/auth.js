import fetchuser from "../middleswares/fetchUser.js";
import { register, login, getUser, googleAuth } from "../controllers/authUser.js";
import express from "express";

const userrouter = express.Router();

userrouter.post("/register", register);
userrouter.post("/login", login);
userrouter.post("/google", googleAuth);
userrouter.get("/getUser", fetchuser, getUser);

export default userrouter;
