const {
  addexpense,
  getexpenses,
  deleteexpense,
} = require("../controllers/expense");
const {
  addincome,
  getincomes,
  deleteincome,
} = require("../controllers/income");
const fetchuser = require("../middleswares/fetchUser.js");

const router = require("express").Router();

router.post("/addincome", fetchuser, addincome);
router.get("/getincomes", fetchuser, getincomes);
router.delete("/deleteincome/:id", deleteincome);
router.post("/addexpense", addexpense);
router.get("/getexpenses", getexpenses);
router.delete("/delete/:id", deleteexpense);
module.exports = router;
