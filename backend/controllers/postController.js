const { db } = require("../config/firebaseAdmin");

exports.createPost = async (req, res) => {
  const { userId, title, content, status } = req.body;

  try {
    const postRef = db.collection("posts").doc();
    await postRef.set({
      userId,
      title,
      content,
      status,
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating post:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the post" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const postsSnapshot = await db.collection("posts").get();
    const posts = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching posts" });
  }
};

exports.getUserPosts = async (req, res) => {
  const { userId } = req.params;

  try {
    const postsSnapshot = await db
      .collection("posts")
      .where("userId", "==", userId)
      .get();

    const posts = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching user posts" });
  }
};
