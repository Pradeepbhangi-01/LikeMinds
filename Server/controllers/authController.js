const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send(error(400, "All fields are required"));
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send(error(409, "User is already registered"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    return res.send(
      success(201, {
        user,
      })
    );
  } catch (error) {
    console.log("error while creating the user", error);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send(error(400, "required all fields"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.send(error(404, "User not registered"));
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.send(error(403, "Incorrect Password"));
    }

    const accessToken = generateAccessToken({
      _id: user._id,
    });
    const refreshToken = generaterefreshToken({ _id: user._id });

    // setting the cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, { accessToken }));
  } catch (e) {
    console.log("Error while signing in", e);
  }
};

// Internal functions

// Generate access Token
const generateAccessToken = (data) => {
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: "20s",
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
  const cookies = req.cookies;
  if (!cookies.jwt) {
    // return res.status(401).send("Refresh Token is required");
    return res.send(error(401, "Refresh Token in cookie is required"));
  }

  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    const _id = decoded._id;

    const accessToken = generateAccessToken({ _id });

    return res.send(success(201, { accessToken }));
  } catch (error) {
    // return res.status(401).send("Invalid refresh token");
    return res.send(error(401, "Invalid refresh token"));
  }
};

module.exports = {
  signupController,
  loginController,
  refreshTokenConntroller,
};
