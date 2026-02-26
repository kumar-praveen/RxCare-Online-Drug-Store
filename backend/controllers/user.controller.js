import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Register User : /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "All credentials are required",
      });
    }

    const existingUser = await User.findOne({ email });
    console.log(existingUser);

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });
    console.log(user);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: "true", //prevent javascript to access cookie
      secure: process.env.NODE_ENV === "production", //Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiration time
    });

    return res.json({
      success: true,
      message: `Welcome ${user.name}`,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//Login User : /api/user/login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "All Credentials Are Required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: "true", //prevent javascript to access cookie
      secure: process.env.NODE_ENV === "production", //Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiration time
    });

    return res.json({
      success: true,
      message: `Welcome Back ${user.name}`,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// Check Auth : /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId).select("-password");

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Logout User : /api/user/logout

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
