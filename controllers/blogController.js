const Blog = require("../models/blog");

const blog_index = async (req, res) => {
  try {
    const result = await Blog.find().sort({ createdAt: -1 });
    if (result.length === 0) throw new Error("No blogs found");

    res.render("./blogs/index", { title: "All Blogs", blogs: result });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const blog_details = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const result = await Blog.findById(id);
    res.render("./blogs/details", { title: "Blog Details", blog: result });
  } catch (err) {
    console.log(err);
    res.status(404).render("404", { title: "Blog not found" });
  }
};

const blog_create_get = async (req, res) => {
  await res.render("./blogs/create", { title: "Create a new blog" });
};
const blog_create_post = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.redirect("/blogs");
  } catch (err) {
    console.log(err);
    await res.status(500).send("Internal Server Error");
  }
};

const blog_delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Blog.findByIdAndDelete(id);
    res.json({ redirect: "/blogs" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  blog_index,
  blog_details,
  blog_create_get,
  blog_create_post,
  blog_delete,
};
