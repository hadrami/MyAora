const { db, admin } = require("../config/firebaseAdmin");

// Assuming this is your Firestore setup

exports.createPost = async (req, res) => {
  try {
    const {
      Id,
      title,
      description,
      images,
      category,
      location,
      status,
      userId,
    } = req.body;

    // Check if required fields are missing
    if (
      !title ||
      !description ||
      !category ||
      !status ||
      !userId ||
      !location
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Reference to the 'posts' collection in Firestore
    const postRef = admin.firestore().collection("posts");
    // Save the post in Firestore

    const newPostRef = postRef.doc();
    await newPostRef.set({
      Id: newPostRef.id,
      title,
      description,
      images,
      category,
      location,
      status,
      userId,
      createdAt: new Date(),
    });

    // Return the created post data
    return res.status(201).json({ message: "Post created  successfully" });
  } catch (error) {
    console.log("Error creating post:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
};

exports.getPosts = async (req, res) => {
  try {
    // Reference to the 'posts' collection
    const postsRef = admin.firestore().collection("posts");

    // Get all documents from the 'posts' collection
    const snapshot = await postsRef.get();

    // Check if there are no posts
    if (snapshot.empty) {
      return res.status(404).json({ error: "No posts found." });
    }

    // Extract posts data from the documents, using the existing 'id' field inside each post
    const posts = snapshot.docs.map((doc) => {
      return {
        ...doc.data(), // Use the data as it is, including the 'id' field already in the data
      };
    });

    // Return the list of posts
    return res.status(200).json({ posts });
  } catch (error) {
    console.log("Error fetching posts:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the posts." });
  }
};

// Function to get a specific post by Id
exports.getPostById = async (req, res) => {
  try {
    // Get the postId from the request parameters
    const { id } = req.params;

    // Reference to the specific document in the 'posts' collection
    const postRef = admin.firestore().collection("posts").doc(id);

    // Get the document
    const postDoc = await postRef.get();

    // Check if the document exists
    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Return the post data, including the document ID
    const post = {
      Id: postDoc.Id,
      ...postDoc.data(),
    };

    return res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post by Id:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the post." });
  }
};
