const jwt = require("jsonwebtoken");

const tockenChecker = async (req, res, next) => {
  try {
    if (req.headers.token) {
      const user = await jwt.verify(req.headers.token, process.env.JWT_SECRET);
      req.decodeData = user;
      next();
    } else {
      res
        .status(201)
        .json({ error: { success: false, message: "invalid Credentials" } });
    }
  } catch (error) {
    res.status(500).json({
      error: { success: false, message: "Invalid Credentials" + error },
    });
  }
};

module.exports = tockenChecker;
