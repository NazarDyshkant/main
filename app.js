const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method")); 

mongoose.connect("mongodb://localhost:27017/blogDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

let Schema = mongoose.Schema;
let postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});
let postModel = mongoose.model("postModel", postSchema);

app.get("/", async (req, res) => {
  try {
    const posts = await postModel.find({}); 
    res.render("index", { title: "Home", posts: posts }); 
  } catch (err) {
    console.log(err);
    res.send("Error occurred while fetching posts");
  }
});

app.get("/add-post", (req, res) => {
  res.render("add-post", { title: "Add New Post" }); 
});

app.post("/add-post", async (req, res) => {
  const newPost = new postModel({
    title: req.body.title,
    author: req.body.author,
  });

  try {
    await newPost.save(); 
    res.redirect("/"); 
  } catch (err) {
    console.log(err);
    res.send("Error occurred while saving the post");
  }
});

app.get("/edit-post/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id); 
    res.render("edit-post", { title: "Edit Post", post: post }); 
  } catch (err) {
    console.log(err);
    res.send("Error occurred while fetching the post");
  }
});

app.put("/edit-post/:id", async (req, res) => {
  try {
    const post = await postModel.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      author: req.body.author,
    });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("Error occurred while updating the post");
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    await postModel.findByIdAndDelete(req.params.id); 
    res.send("Post deleted successfully");  
  } catch (err) {
    console.log(err);
    res.send("Error occurred while deleting the post");
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await postModel.find({});
    res.render("posts", { title: "All Posts", posts: posts });  
  } catch (err) {
    console.log(err);
    res.send("Error occurred while fetching posts");
  }
});


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
