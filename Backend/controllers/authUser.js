const UserSchema = require("../models/UserSchema");
require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const checkEmail = await UserSchema.findOne({ email: email });
    if (checkEmail) {
      res.status(400).json({ message: "User already exists!" });
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
      res.statue(200).json({ authToken: authToken });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};
