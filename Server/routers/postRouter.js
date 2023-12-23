const router = require("express").Router();

const postController = require("../controllers/postController");
const requireUser = require("../middleware/requireUser");

router.get("/all", requireUser, postController.getAllPosts);
router.post("/", requireUser, postsController.createPostController);
router.post("/like", requireUser, postsController.likeAndUnlikePost);
router.put("/", requireUser, postsController.updatePostController);
router.delete("/", requireUser, postsController.deletePost);

module.exports = router;
