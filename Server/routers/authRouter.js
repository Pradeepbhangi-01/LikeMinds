const router = require("express").Router();

const authController = require("../controllers/authController");

router.post("/signup", authController.signupController);
router.get("/signin", authController.signinController);
router.get("/refresh", authController.refreshTokenConntroller);

module.exports = router;
