const { addincome } = require("../controllers/income");

const router = require("express").Router();

router.post("/addincome", addincome);
module.exports = router;
