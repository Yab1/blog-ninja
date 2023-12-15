const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes");
require("dotenv").config();

// express app
const app = express();

// connection to mongodb
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected to MongoDB");
    app.listen(3000);
    console.log("Server is running on port 3000");
  } catch (err) {
    console.error(err);
  }
})();

// register view engine
app.set("view engine", "ejs");

// middleware and static file
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// blog routes
app.use("/blogs", blogRoutes);

// 404 paage
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
