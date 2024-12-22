const express = require("express");
const {
  signup,
  signin,
  checkPhone,
  checkUsername,
  getUserProfile,
  userPosts,
  resetPassword,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.post("/checkPhone", checkPhone);
router.post("/checkUsername", checkUsername);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/resetPassword", resetPassword);
router.get("/users/:userId", getUserProfile);
router.get("/users/:userId/posts", userPosts);
router.post("/logout", logout);

module.exports = router;
