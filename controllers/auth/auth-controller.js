const bcrypt = require("bcryptjs");
const User = require("../../models/UserSchema");
const jwt = require("jsonwebtoken");

// 1. Register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const useExists = await User.findOne({ email });
    if (useExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ userName, email, password: hashPassword });
    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Registered Succesfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};
// 2. Login

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist. Please register",
      });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    if(!verifyPassword){
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }
    const token = jwt.sign({ user }, 'process.env.JWT_SECRET', {
        expiresIn: "60m",
      });

      res.cookie('token', token, {httpOnly: true,secure: false}).json({
      success: true,
      message: "Logged in Succesfully",
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};

// 3. Logout
const logoutUser = (req, res) => { res.clearCookie('token').json({
  success: true,
  message: "Logged out Succesfully",
})
};

// 4. Middleware
const authMiddleware = async(req, res, next) => { 
  const token = req.cookies.token;
  if(!token){
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const { user } = jwt.verify(token, 'process.env.JWT_SECRET');
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
}

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
