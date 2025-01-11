const { admin, bucket } = require("../config/firebaseAdmin");
const redisClient = require("../config/redisConfig"); // Your Redis configuration

// Create a post and clear Redis cache
exports.createPost = async (req, res) => {
  try {
    const {
      Id,
      title,
      description,
      category,
      location,
      status,
      price,
      userId,
    } = req.body;
    const images = req.files || []; // Assuming images are sent as files

    if (
      !title ||
      !description ||
      !category ||
      !status ||
      !price ||
      !userId ||
      !location
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Upload images to Firebase Storage
    const imageUrls = [];
    for (const image of images) {
      const file = bucket.file(`posts/${Date.now()}_${image.originalname}`);
      await file.save(image.buffer, { contentType: image.mimetype });
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(file.name)}?alt=media`;
      imageUrls.push(imageUrl);
    }

    // Save post to Firestore
    const postRef = admin.firestore().collection("posts");
    const newPostRef = postRef.doc();
    const postData = {
      Id: newPostRef.id,
      title,
      description,
      category,
      location,
      status,
      price,
      userId,
      images: imageUrls,
      createdAt: new Date(),
    };

    await newPostRef.set(postData);

    // Clear Redis cache for posts
    await redisClient.del("posts");

    return res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating post:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
};

// Fetch all posts and cache them
exports.getPosts = async (req, res) => {
  try {
    // Check Redis cache

    const cachedPosts = await redisClient.get("posts");
    if (cachedPosts) {
      console.log("Cache hit for posts");
      return res.status(200).json({ posts: JSON.parse(cachedPosts) });
    }

    // Fetch posts from Firestore
    const postsRef = admin.firestore().collection("posts");
    const snapshot = await postsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No posts found." });
    }

    const posts = snapshot.docs.map((doc) => doc.data());

    // Cache posts in Redis for 1 hour
    await redisClient.set("posts", JSON.stringify(posts), { EX: 3600 });

    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching posts." });
  }
};

// Fetch a specific post by Id and cache it
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check Redis cache
    const cachedPost = await redisClient.get(`post:${id}`);
    if (cachedPost) {
      console.log("Cache hit for post:", id);
      return res.status(200).json(JSON.parse(cachedPost));
    }

    // Fetch post from Firestore
    const postRef = admin.firestore().collection("posts").doc(id);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found." });
    }

    const post = { Id: id, ...postDoc.data() };

    // Cache post in Redis for 1 hour
    await redisClient.set(`post:${id}`, JSON.stringify(post), { EX: 3600 });

    return res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post by Id:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the post." });
  }
};

// Search posts and cache results
exports.searchPosts = async (req, res) => {
  try {
    const { query } = req.params;

    // Check Redis cache
    const cachedSearch = await redisClient.get(`search:${query}`);
    if (cachedSearch) {
      console.log("Cache hit for search:", query);
      return res.status(200).json({ posts: JSON.parse(cachedSearch) });
    }

    // Fetch posts from Firestore
    const postsRef = admin.firestore().collection("posts");
    const snapshot = await postsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No posts found." });
    }

    const words = query.trim().split(/\s+/);
    const regexPattern = words.map((word) => `(?=.*\\b${word}\\b)`).join("");
    const regex = new RegExp(`^${regexPattern}.*`, "i");

    const filteredPosts = snapshot.docs
      .map((doc) => ({ Id: doc.id, ...doc.data() }))
      .filter(
        (post) =>
          (post.title && regex.test(post.title)) ||
          (post.description && regex.test(post.description)) ||
          (post.location && regex.test(post.location))
      );

    if (filteredPosts.length === 0) {
      return res.status(404).json({ error: "No matching posts found." });
    }

    // Cache search results in Redis for 10 minutes
    await redisClient.set(`search:${query}`, JSON.stringify(filteredPosts), {
      EX: 600,
    });

    return res.status(200).json({ posts: filteredPosts });
  } catch (error) {
    console.error("Error searching posts:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while searching for posts." });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Reference to the specific document
    const postRef = admin.firestore().collection("posts").doc(id);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Delete associated images from Firebase Storage
    const images = postDoc.data().images || [];
    for (const image of images) {
      const filePath = decodeURIComponent(image.split("?")[0].split("/o/")[1]);
      const file = bucket.file(filePath);
      await file.delete().catch(() => {}); // Ignore file not found errors
    }

    // Delete post
    await postRef.delete();

    // Clear Redis cache
    await redisClient.del("posts");

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ error: "Failed to delete post." });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params; // Extract post ID from params
    const updatedData = req.body; // Extract updated fields from request body
    const images = req.files || []; // Extract uploaded images

    if (!id) {
      return res.status(400).json({ error: "Post ID is required." });
    }

    const postRef = admin.firestore().collection("posts").doc(id);

    // Fetch the current post data
    const existingPost = (await postRef.get()).data();

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Handle image uploads if any new images are provided
    let imageUrls = existingPost.images || [];

    if (images.length > 0) {
      const uploadedImageUrls = [];
      for (const image of images) {
        const file = bucket.file(`posts/${Date.now()}_${image.originalname}`);
        await file.save(image.buffer, { contentType: image.mimetype });
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(file.name)}?alt=media`;
        uploadedImageUrls.push(imageUrl);
      }
      // Merge existing images with new ones
      imageUrls = [...imageUrls, ...uploadedImageUrls];
    }

    // Update the post in Firestore
    await postRef.update({ ...updatedData, images: imageUrls });

    // Clear Redis cache
    await redisClient.del(`post:${id}`);
    await redisClient.del("posts");

    return res.status(200).json({
      message: "Post updated successfully",
      updatedPost: { id, ...updatedData, images: imageUrls },
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the post." });
  }
};
