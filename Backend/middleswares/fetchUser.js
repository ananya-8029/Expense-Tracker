import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const fetchuser = (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
      res.status(401).json({ message: "Not a valid token!" });
    }

    const data = jwt.verify(token, process.env.JWT_KEY);
    req.user = data.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Not a valid token! " });
  }
};

export default fetchuser;
