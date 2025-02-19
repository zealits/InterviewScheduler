const express = require("express");
const { register, login, getAdminEmail } = require("../controllers/authController");
const {
  registeruser,
  loginuser,
} = require("../controllers/UserauthController");
const { updateUserProfile } = require("../controllers/updateUserProfile");
// const updateUserProfile = require('')
const Admin = require("../models/Admin");
const jwt = require('jsonwebtoken');
const { protect } = require("../middleware/Usermiddler");
const { authenticateAdmin } = require("../middleware/authMiddleware");
const { protectUser } = require("../middleware/UserMid");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/user/register", registeruser);
router.post("/user/login", loginuser);


router.get("/:email/admin-email", authenticateAdmin, getAdminEmail);


router.put("/profile", protectUser, updateUserProfile);

module.exports = router;
