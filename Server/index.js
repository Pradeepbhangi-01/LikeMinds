const express = require("express");
const dotenv = require("dotenv");
dotenv.config("./.env");
const dbConnect = require("./dbConnect");
const app = express();
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//middleware
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(morgan("combined"));
app.use(cookieParser());

// routes
app.use("/auth", authRouter);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
  res.status(200).send("Wlecome to server of LikeMinds");
});

const port = process.env.PORT || 4001;

dbConnect();
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
