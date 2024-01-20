const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  fetchGroups,
  AddGroup,
  removeFromGroup
} = require("../Controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/createGroup").post(protect, createGroupChat);
router.route("/renameGroup").put(protect,renameGroup);
router.route("/removeGroup").put(protect,removeFromGroup);
router.route("/AddtoGroup").put(protect,AddGroup);
router.route("/fetchGroups").get(protect, fetchGroups);
module.exports = router;