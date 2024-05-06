const {
  addincome,
  getincomes,
  deleteincome,
} = require("../controllers/income");

const router = require("express").Router();

router.post("/addincome", addincome);
router.get("/getincomes", getincomes);
router.delete("/deleteincome/:id", deleteincome);
module.exports = router;
