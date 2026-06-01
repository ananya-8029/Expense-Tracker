import UserModel from "../models/UserSchema.js";
import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client();

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const checkEmail = await UserModel.findOne({ email: email });
    if (checkEmail) {
      return res.status(400).json({ message: "User already exists!" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const securedPassword = await bcrypt.hash(password, salt);

      const newUser = await UserModel.create({
        username: username,
        email: email,
        password: securedPassword,
      });

      const data = { newUser: { id: newUser.id } };

      const authToken = jwt.sign(data, process.env.JWT_KEY, { expiresIn: 3600 });
      return res.status(200).json({ authToken: authToken });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

const login = async (request, response) => {
  const { email, password } = request.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(500).json({ message: "Invalid User Credentials" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return response.status(500).json({ message: "Invalid User Credentials" });
    }

    const data = { user: { id: user.id } };

    const signinToken = jwt.sign(data, process.env.JWT_KEY, {
      expiresIn: 3600,
    });

    return response.status(200).json({ authToken: signinToken, user: user });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ message: "Not a valid user! " });
  }
};

const googleAuth = async (req, res) => {
  const { accessToken } = req.body;
  try {
    const googleRes = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
    );
    const { id, email, name, picture } = await googleRes.json();

    if (!id || !email) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());
    const role = adminEmails.includes(email.toLowerCase()) ? "admin" : "user";

    let user = await UserModel.findOne({ googleId: id });
    if (!user) {
      user = await UserModel.create({ googleId: id, email, username: name, picture, role });
    } else if (user.role !== role) {
      user.role = role;
      await user.save();
    }

    const data = { user: { id: user.id, role: user.role } };
    const authToken = jwt.sign(data, process.env.JWT_KEY, { expiresIn: 3600 });

    return res.status(200).json({ authToken, user });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Google authentication failed" });
  }
};

const updateProfile = async (req, res) => {
  const { phone, address } = req.body;
  try {
    const update = {};
    if (phone !== undefined) update.phone = phone.trim();
    if (address) {
      update["address.street"]  = address.street?.trim() ?? "";
      update["address.city"]    = address.city?.trim() ?? "";
      update["address.state"]   = address.state?.trim() ?? "";
      update["address.country"] = address.country?.trim() ?? "";
      update["address.pincode"] = address.pincode?.trim() ?? "";
    }
    const user = await UserModel.findByIdAndUpdate(req.user.id, { $set: update }, { new: true });
    return res.status(200).json({ phone: user.phone, address: user.address });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Failed to update profile." });
  }
};

const updateUsername = async (req, res) => {
  const { username } = req.body;
  if (!username?.trim()) return res.status(400).json({ message: "Name cannot be empty." });
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { username: username.trim() },
      { new: true }
    );
    return res.status(200).json({ username: user.username });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Failed to update name." });
  }
};

const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });
    const pictureUrl = `${process.env.SERVER_URL || "http://localhost:8000"}/uploads/profile-photos/${req.file.filename}`;
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { picture: pictureUrl },
      { new: true }
    );
    return res.status(200).json({ picture: user.picture });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Failed to update photo." });
  }
};

export { getUser, login, register, googleAuth, updateProfilePhoto, updateUsername, updateProfile };
