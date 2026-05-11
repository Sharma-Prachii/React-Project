const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUsers,
  changePassword,
  forgotPassword,
  resetPassword,
  sendOtp,
  verifyOtp,
  getCurrentUser,
  removeProfileImage,
  searchUser
} = require("../controllers/user.controller");

const {
  validateCreateUser,
  validateId
} = require("../middleware/user.validation");

router.post("/login", loginUsers);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/", validateCreateUser, createUser);
router.post("/forgot-password", forgotPassword);

router.put("/reset-password/:token", resetPassword);
router.put("/change-password", auth, changePassword);
router.put("/updateUser", auth, upload.single("image"), updateUser);

router.delete("/remove-profile-image", auth, removeProfileImage);
router.delete("/:id", auth, validateId, deleteUser);


router.get("/search", auth, searchUser);
router.get("/", auth, getUsers);
router.get("/:id", auth, validateId, getUser);

module.exports = router;