const { register, login, getUser } = require("../controllers/authUser");
const fetchuser = require("../middleswares/fetchUser");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getUser",fetchuser, getUser);
module.exports = router;
