const router = require("express").Router();
const Post = require("../models/Posts");
const Users = require("../models/Users");
// creste a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const post = newPost.save();
    res.status(200).json({ success: true, message: "Post created Succesfuly" });
  } catch (err) {
    res.status(500).json({ error: { message: "Internal Error Occurs" } });
  }
});
// Update a post
router.put("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!!post && post.userId === req.body.userId) {
    try {
      await post.updateOne({ $set: req.body });
      res.status(200).json({
        error: { success: true, message: "Post Updated Succesful" },
      });
    } catch (err) {
      res
        .status(500)
        .json({ error: { message: "Internal Error Occurs" + err } });
    }
  } else {
    res.status(403).send({
      error: { success: false, message: "You can Update Only Your Post " },
    });
  }
});
// Delete a Post
router.delete("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!!post && post.userId === req.body.userId) {
    try {
      await post.deleteOne({ $set: req.body });
      res.status(200).json({
        error: { success: true, message: "Post Updated Deleted Succesful" },
      });
    } catch (err) {
      res
        .status(500)
        .json({ error: { message: "Internal Error Occurs" + err } });
    }
  } else {
    res.status(403).send({
      error: { success: false, message: "You can Delete Only Your Post " },
    });
  }
});

// Like a post
router.put("/:id/like", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post.likes.includes(req.body.userId)) {
    await post.updateOne({ $push: { likes: req.body.userId } });
    res.status(200).json({ success: true, message: "Post liked" });
  } else {
    await post.updateOne({ $pull: { likes: req.body.userId } });
    res.status(200).json({ success: true, message: "Post Disliked" });
  }
});
// get a Post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: { message: "Internal Error Occurs" + err } });
  }
});
// get timeline Posts

router.get("/timeline/all", async (req, res) => {
  let postArray = [];
  try {
    const currentUser = await Users.findById(req.body.userId);
    const post = await Post.find({ userId: currentUser.id });
    const friendPost = await Promise.all(
      currentUser.following.map((freinds) => {
        return Post.find({ userId: freinds });
      })
    );
    res.status(200).json(post.concat(friendPost));
  } catch (err) {
    res.status(500).json({ error: { message: "Internal Error Occurs" + err } });
  }
});

module.exports = router;
