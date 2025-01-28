const express = require("express");
const { register, login } = require("../controllers/authController");
const {
  registeruser,
  loginuser,
} = require("../controllers/UserauthController");
const { updateUserProfile } = require("../controllers/updateUserProfile");
// const updateUserProfile = require('')

const { protect } = require("../middleware/Usermiddler");
const { protectUser } = require("../middleware/UserMid");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/user/register", registeruser);
router.post("/user/login", loginuser);


router.put("/profile", protectUser, updateUserProfile);

module.exports = router;
