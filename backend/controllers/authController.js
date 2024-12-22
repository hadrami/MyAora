const bcrypt = require("bcryptjs");
const { db, admin } = require("../config/firebaseAdmin");

exports.signup = async (req, res) => {
  const { Id, username, phone, password } = req.body;
  try {
    const usersRef = admin.firestore().collection("users");
    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 8);
    // Create a new user in Firestore (not in Firebase Authentication)
    const newUserRef = usersRef.doc(); // Generate a new document ID
    await newUserRef.set({
      Id: newUserRef.id,
      username,
      phone,
      password: hashedPassword,
    });

    // Return success response
    return res.status(201).json({ message: "User signed up successfully" });
  } catch (error) {
    console.error("Signup error:", error); // Log error for debugging
    return res.status(500).json({ message: "An error occurred during signup" });
  }
};

exports.checkUsername = async (req, res) => {
  const { username } = req.body;

  try {
    const usersRef = db.collection("users");
    const usernameQuery = await usersRef
      .where("username", "==", username)
      .get();

    if (!usernameQuery.empty) {
      return res.json({ isAvailable: false }); // Username already taken
    } else {
      return res.json({ isAvailable: true }); // Username is available
    }
  } catch (error) {
    console.error("Error checking username:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.checkPhone = async (req, res) => {
  const { phone } = req.body;

  try {
    const usersRef = db.collection("users");
    const phoneQuery = await usersRef.where("phone", "==", phone).get();

    if (!phoneQuery.empty) {
      return res.json({ isAvailable: false }); // Phone number already taken
    } else {
      return res.json({ isAvailable: true }); // Phone number is available
    }
  } catch (error) {
    console.error("Error checking phone:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const userSnapshot = await db
      .collection("users")
      .where("phone", "==", phone)
      .get();
    if (userSnapshot.empty) {
      return res.status(404).send("User not found");
    }

    const user = userSnapshot.docs[0].data();
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send("Incorrect password");
    }

    const customToken = await admin
      .auth()
      .createCustomToken(userSnapshot.docs[0].id);
    return res.status(200).json({ token: customToken });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const userSnapshot = await db.collection("users").doc(userId).get();

    if (!userSnapshot.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userSnapshot.data();
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching user profile" });
  }
};

exports.userPosts = async (req, res) => {
  const { userId } = req.params;

  try {
    // Reference to the 'posts' collection
    const postsRef = db.collection("posts");
    // Query posts where the userId matches the provided userId
    const postsQuerySnapshot = await postsRef
      .where("userId", "==", userId)
      .get();

    // Check if any posts were found
    if (postsQuerySnapshot.empty) {
      return res.status(404).json({ message: "No posts found" });
    }

    // Extract the post data from each document
    const userPosts = postsQuerySnapshot.docs.map((doc) => ({
      ...doc.data(), // Spread the post data
    }));

    // Return the posts in the response
    return res.status(200).json(userPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching user posts" });
  }
};

exports.resetPassword = async (req, res) => {
  const { phone, newPassword } = req.body;

  try {
    const usersRef = db.collection("users");
    const userQuery = await usersRef.where("phone", "==", phone).get();

    if (userQuery.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userQuery.docs[0].id;
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    await usersRef.doc(userId).update({ password: hashedPassword });

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Failed to reset password." });
  }
};

exports.logout = async (req, res) => {
  try {
    const { uid } = req.body; // Expect UID from request
    await admin.auth().revokeRefreshTokens(uid);
    res.status(200).send("User logged out successfully");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
