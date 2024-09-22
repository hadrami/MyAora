const express = require("express");
const {
  createPost,
  getPosts,
  getUserPosts,
} = require("../controllers/postController");

const router = express.Router();

router.post("/createPost", createPost);
router.get("/posts", getPosts);
router.get("/user/:userId", getUserPosts);

module.exports = router;
