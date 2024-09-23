const express = require("express");
const {
  signup,
  signin,
  logout,
  checkPhone,
  checkUsername,
  getUserProfile,
} = require("../controllers/authController");

const router = express.Router();

router.post("/checkPhone", checkPhone);
router.post("/checkUsername", checkUsername);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.get("/user/:userId", getUserProfile);

module.exports = router;
