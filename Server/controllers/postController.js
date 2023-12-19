const getAllPosts = async (req, res) => {
  console.log(req._id);
  return res.send("get all the user data");
};

module.exports = {
  getAllPosts,
};
