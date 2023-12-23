const router = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const UserController = require("../controllers/userController");

router.get("/getMyInfo", requireUser, UserController.getMyInfo);

router.put("/", requireUser, UserController.updateUserProfile);
router.post("/getUserProfile", requireUser, UserController.getUserProfile);
router.post(
  "/follow",
  requireUser,
  UserController.followOrUnfollowUserController
);
router.get(
  "/getPostsOfFollowing",
  requireUser,
  UserController.getPostsOfFollowing
);
router.get("/getMyPosts", requireUser, UserController.getMyPosts);
router.get("/getUserPosts", requireUser, UserController.getUserPosts);
router.delete("/", requireUser, UserController.deleteMyProfile);

module.exports = router;
