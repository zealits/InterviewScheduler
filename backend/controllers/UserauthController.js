// User Controller
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register User
exports.registeruser = async (req, res) => {
  const {
    name,
    email,
    password,
    linkedinProfile,
    yearOfExperience,
    experienceAsInterviewer,
    specialization,
    candidatesInterviewed,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({
      name,
      email,
      password,
      linkedinProfile,
      yearOfExperience,
      experienceAsInterviewer,
      specialization,
      candidatesInterviewed,
    });

    res.status(201).json({ token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login User
exports.loginuser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    //  console.log(generateToken(user._id));
    res.status(200).json({ token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
