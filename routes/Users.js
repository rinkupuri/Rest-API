const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const tockenChecker = require("../middleware/AuthChecker");

const router = require("express").Router();
// Update user
router.put("/:id", tockenChecker, async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
      } catch (error) {
        res.status(500).send({
          error: {
            message: "internal Server Error " + error,
            instruction: "try again after sometime",
          },
        });
      }
    }
    try {
      const updateduser = await Users.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res
        .status(200)
        .json({ success: true, message: "User Updated Successfuly" });
    } catch (error) {
      res.status(500).send({
        error: {
          message: "internal Server Error " + error,
          instruction: "try again after sometime",
        },
      });
    }
  } else {
    res.status(500).send({
      error: {
        message: "Access Denied User Not authenticated",
        instruction: "try again after sometime",
      },
    });
  }
});
// delete user
router.delete("/:id", tockenChecker, async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const updateduser = await Users.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ success: true, message: "User Deleted Successfuly" });
    } catch (error) {
      res.status(500).send({
        error: {
          message: "internal Server Error " + error,
          instruction: "try again after sometime",
        },
      });
    }
  } else {
    res.status(500).send({
      error: {
        message: "Access Denied User Not authenticated",
        instruction: "try again after sometime",
      },
    });
  }
});

// get a user
router.get("/:id", tockenChecker, async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    const { password, isAdmin, createdAt, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json({ error: { message: "Internal Error Occurs" } });
  }
});
// follow user
router.put("/:id/follow", tockenChecker, async (req, res) => {
  if (req.params.id !== req.body.userId) {
    const user = await Users.findById(req.params.id);
    const currentUser = await Users.findById(req.body.userId);
    if (!user.follower.includes(req.body.userId)) {
      await user.updateOne({ $push: { follower: req.body.userId } });
      await currentUser.updateOne({ $push: { following: req.params.id } });

      res.status(200).json({ Sucess: true, message: "follow added" });
    } else {
      res
        .status(409)
        .json({ Sucess: true, message: "You Already follow this user" });
    }
  } else {
    res.status(409).json({ Sucess: true, message: "you cant follow yourself" });
  }
});
// unfollow user
router.put("/:id/unfollow", tockenChecker, async (req, res) => {
  if (req.params.id !== req.body.userId) {
    const user = await Users.findById(req.params.id);
    const currentUser = await Users.findById(req.body.userId);
    if (user.follower.includes(req.body.userId)) {
      await user.updateOne({ $pull: { follower: req.body.userId } });
      await currentUser.updateOne({ $pull: { following: req.params.id } });

      res.status(200).json({ Sucess: true, message: "Unfollow Successful" });
    } else {
      res
        .status(409)
        .json({ Sucess: true, message: "You are not followed this user" });
    }
  } else {
    res
      .status(409)
      .json({ Sucess: true, message: "you cant unfollow yourself" });
  }
});

module.exports = router;
