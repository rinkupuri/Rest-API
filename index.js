const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const dbConnect = require("./config/db");
const userRoute = require("./routes/Users");
const postRoute = require("./routes/Posts");
const auth = require("./routes/Auth");
dotenv.config();
dbConnect();

const port = 8800;

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/post", postRoute);
app.use("/api/auth", auth);

app.get("/", (req, res) => {
  res.send("Hello beta Server is Live Now ");
});

app.listen(port, () => {
  console.log("Server is Runing");
});
