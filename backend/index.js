const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
app.use(
  cors({
    origin: "*", // Allows all origins (for development)
  })
);
app.use(bodyParser.json());
// Handle favicon requests to avoid errors
app.get("/favicon.ico", (req, res) => res.sendStatus(204));

// Routes
app.use("/auth", authRoutes); // Authentication routes
app.use("/posts", postRoutes); // Post routes

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
