const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tockenChecker = require("../middleware/AuthChecker");

// Register
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // cerate new user
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // save user to database
    const user = await newUser.save();
    const token = jwt.sign(
      { id: user.id, email: user.email, password: user.password },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ data: token });
  } catch (error) {
    res.status(500).send({
      error: {
        message: "internal Server Error" + error,
        instruction: "try again after sometime",
      },
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user &&
      res.status("401").json({ error: { message: "invalid Cardential" } });
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !comparePassword &&
      res.status("401").json({ error: { message: "invalid Cardential" } });

    const token = jwt.sign(
      { email: user.email, password: user.password },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res
      .status(200)
      .json({ data: { user: { email: user.email }, token: token } });
  } catch (error) {
    res.status(500).send({
      error: {
        message: "internal Server Error " + error,
        instruction: "try again after sometime",
      },
    });
  }
});

module.exports = router;
