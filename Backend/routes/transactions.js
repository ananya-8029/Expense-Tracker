const { addincome } = require("../controllers/income");

const router = require("express").Router();

router.post("/add-income", addincome);
module.exports = router;
