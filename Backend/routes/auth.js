import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import fetchuser from "../middleswares/fetchUser.js";
import { register, login, getUser, googleAuth, updateProfilePhoto } from "../controllers/authUser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const profilePhotosDir = path.join(__dirname, "../uploads/profile-photos");
if (!fs.existsSync(profilePhotosDir)) fs.mkdirSync(profilePhotosDir, { recursive: true });

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profilePhotosDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}${ext}`);
  },
});

const uploadPhoto = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const userrouter = express.Router();

userrouter.post("/register", register);
userrouter.post("/login", login);
userrouter.post("/google", googleAuth);
userrouter.get("/getUser", fetchuser, getUser);
userrouter.put("/update-photo", fetchuser, uploadPhoto.single("photo"), updateProfilePhoto);

export default userrouter;
