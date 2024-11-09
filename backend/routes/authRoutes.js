const express = require("express");
const {
  signup,
  signin,
  logout,
  checkPhone,
  checkUsername,
  getUserProfile,
  userPosts,
} = require("../controllers/authController");

const router = express.Router();

router.post("/checkPhone", checkPhone);
router.post("/checkUsername", checkUsername);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.get("/users/:userId", getUserProfile);
router.get("/users/:userId/posts", userPosts);

module.exports = router;
