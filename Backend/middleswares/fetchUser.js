require("dotenv").config();
const jwt = require("jsonwebtoken");

export const fetchuser = async (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
      res.status(401).json({ mesage: "Not a valid token!" });
    }

    const data = jwt.verify(token, process.env.JWT_KEY);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not a valid token! " });
  }
};
