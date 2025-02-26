const express = require("express");
const { register, login, getAdminEmail } = require("../controllers/authController");
const { registeruser, loginuser } = require("../controllers/UserauthController");
const { updateUserProfile } = require("../controllers/updateUserProfile");
const { protectUser } = require("../middleware/UserMid");
const { authenticateAdmin } = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/user/register", registeruser);
router.post("/user/login", loginuser);

router.get("/:email/admin-email", authenticateAdmin, getAdminEmail);


router.put("/profile", protectUser, updateUserProfile);

module.exports = router;
