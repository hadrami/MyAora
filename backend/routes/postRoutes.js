const express = require("express");
const {
  createPost,
  getPosts,
  getUserPosts,
  getPostById,
} = require("../controllers/postController");

const router = express.Router();

router.post("/createPost", createPost);
router.get("/getPosts", getPosts);
router.get("/post/:id", getPostById); // Route for fetching a post by Id

module.exports = router;
