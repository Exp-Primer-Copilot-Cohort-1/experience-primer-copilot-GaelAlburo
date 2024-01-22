//Create web server with express
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Comment = require("./models/comment");
const methodOverride = require("method-override");
const PORT = 3000;

//Connect to database
mongoose.connect("mongodb://localhost:27017/comments", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//Set view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//Use body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//Use method-override
app.use(methodOverride("_method"));

//Create new comment
app.get("/comments/new", (req, res) => {
  res.render("comments/new");
});

//Post comment
app.post("/comments", async (req, res) => {
  const comment = new Comment(req.body.comment);
  await comment.save();
  res.redirect("/comments");
});

//Show all comments
app.get("/comments", async (req, res) => {
  const comments = await Comment.find({});
  res.render("comments/index", { comments });
});

//Show comment by id
app.get("/comments/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  res.render("comments/show", { comment });
});

//Edit comment
app.get("/comments/:id/edit", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  res.render("comments/edit", { comment });
});

//Update comment
app.patch("/comments/:id", async (req, res) => {
  const { id } = req.params;
  await Comment.findByIdAndUpdate(id, req.body.comment);
  res.redirect(`/comments/${id}`);
});

//Delete comment
app.delete("/comments/:id", async (req, res) => {
  const { id } = req.params;
  await Comment.findByIdAndDelete(id);
  res.redirect("/comments");
});

//Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});