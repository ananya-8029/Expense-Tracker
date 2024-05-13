const UserSchema = require("../models/UserSchema");
require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const checkEmail = await UserSchema.findOne({ email: email });
    if (checkEmail) {
      return res.status(400).json({ message: "User already exists!" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const securedPassword = await bcrypt.hash(password, salt);

      const newUser = await UserSchema.create({
        username: username,
        email: email,
        password: securedPassword,
      });

      const data = { newUser: { id: newUser.id } };

      const authToken = jwt.sign(data, process.env.JWT_KEY);
      return res.status(200).json({ authToken: authToken });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(500).json({ message: "Invalid User Credentials" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(500).json({ message: "Invalid User Credentials" });
    }

    const data = { user: { id: user.id } };

    const signinToken = jwt.sign(data, process.env.JWT_KEY, {
      expiresIn: 3600,
    });

    return res.status(200).json({ authToken: signinToken, user: user });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user.id);
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ message: "Not a valid user! " });
  }
};
