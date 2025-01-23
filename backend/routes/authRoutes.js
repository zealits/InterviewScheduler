const express = require('express');
const { register, login } = require('../controllers/authController');
const { registeruser, loginuser } = require('../controllers/UserauthController');

const router = express.Router();

router.post('/admin/register', register);
router.post('/admin/login', login);
router.post('/user/register', registeruser);
router.post('/user/login', loginuser);

module.exports = router;
