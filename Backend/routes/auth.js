const { register } = require("../controllers/authUser");

const router = require("express").Router();

router.post("/register", register);
module.exports = router;
