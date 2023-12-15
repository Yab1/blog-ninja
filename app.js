const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
require("dotenv").config();

const app = express();

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

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", async (req, res) => {
  try {
    const result = await Blog.find().sort({ createdAt: -1 });
    if (result.length === 0) throw new Error("No blogs found");

    res.render("index", { title: "All Blogs", blogs: result });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/blogs", async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.redirect("/blogs");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new blog" });
});

app.get("/blogs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const result = await Blog.findById(id);
    res.render("details", { title: "Blog Details", blog: result });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error ");
  }
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.delete("/blogs/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await Blog.findByIdAndDelete(id);
    res.json({ redirect: "/blogs" });
  } catch (err) {
    console.log(err);
  }
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
