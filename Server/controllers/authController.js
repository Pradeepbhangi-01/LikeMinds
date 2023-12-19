const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("All fields are required");
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User is already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      user,
    });
  } catch (error) {
    console.log("error while creating the user", error);
  }
};

const signinController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(409).send("required all fields");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not registered");
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.status(403).send("Incorrect Password");
    }

    const accesstoken = generateAccessToken({
      _id: user._id,
    });
    const refreshToken = generaterefreshToken({ _id: user._id });
    return res.json({ accesstoken, refreshToken });
  } catch (error) {
    console.log("Error while signing in", error);
  }
};

// Internal functions

// Generate Token
const generateAccessToken = (data) => {
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: "5m",
  });
  console.log(token);
  return token;
};

// Generate refresh token
const generaterefreshToken = (data) => {
  const refToken = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
    expiresIn: "1y",
  });
  console.log(refToken);
  return refToken;
};

// To check the validity of refresh token and generate the accesstoken

const refreshTokenConntroller = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).send("refreshToken is required");
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    const _id = decoded._id;

    const accessToken = generateAccessToken({ _id });

    return res.status(201).json({ accessToken });
  } catch (error) {
    return res.status(401).send("Invalid refresh token");
  }
};

module.exports = {
  signupController,
  signinController,
  refreshTokenConntroller,
};
