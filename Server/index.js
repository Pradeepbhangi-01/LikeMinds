const express = require("express");
const dotenv = require("dotenv");
dotenv.config("./.env");
const dbConnect = require("./dbConnect");
const app = express();
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const morgan = require("morgan");

//middleware
app.use(express.json());
app.use(morgan("combined"));

// routes
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.get("/", (req, res) => {
  res.status(200).send("Wlecome to server of LikeMinds");
});

const port = process.env.PORT || 4000;

dbConnect();
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
