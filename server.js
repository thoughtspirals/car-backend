const express = require("express");
const multer = require("multer");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const currentUser = require("./Routes/user/currentUser");
const connectDB = require("./config/database");
const AdminRoutes = require("./Routes/Admin/AdminRoutes");
const authroutes = require("./Routes/authroutes");
const productRoutes = require("./Routes/product/productRoutes");
require("dotenv").config();
const cookieParser = require("cookie-parser");

// Initialize Express app
const app = express();

app.use(cookieParser());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 3600000, // 1 hour
    },
  })
);

// Connect to the database
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true, // Allow cookies
  })
);

//Admin
app.use(
  cors({
    origin: "http://localhost:4000", // Frontend URL
    credentials: true, // Allow cookies
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/admin", AdminRoutes);
app.use("/auth", authroutes);
app.use("/products", productRoutes); // Add product routes

// Routes
app.get("/", (req, res) => {
  res.send("Car Works server is running!");
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
