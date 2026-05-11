const User = require("../models/user.model.js");
const bcrypt = require("bcrypt"); 
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../config");
const nodemailer = require("nodemailer");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const cloudinary = require("cloudinary").v2;

const loginUsers = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.secret,
      { expiresIn: "1d" }
    );

    const { password: _, ...userData } = user._doc;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendOtp = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sharmaprachi2503@gmail.com",
        pass: "oiclyagahfgjnxyj"
      }
    });

    await transporter.sendMail({
      from: "sharmaprachi2503@gmail.com",
      to: user.email,
      subject: "OTP",
      html: `<h3>Your OTP is: ${otp}</h3>`
    });

    res.status(200).json({ message: "OTP sent" });

  } catch {
    res.status(500).json({ message: "OTP SEND FAILED" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      otp: otp.toString(),
      otpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.secret,
      { expiresIn: "1d" }
    );

    const { password: _, ...userData } = user._doc;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData
    });

  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, phoneNo, password, ...rest } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (phoneNo && await User.findOne({ phoneNo })) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: normalizedEmail,
      phoneNo,
      role: "user",
      ...rest,
      password: hashedPassword
    });

    res.status(201).json({
      message: "USER CREATED SUCCESSFULLY",
      user
    });

  } catch {
    res.status(500).json({ message: "CREATE USER FAILED" });
  }
};


const getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();

    const users = await User.find({})
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limit)
      .select("firstName lastName email phoneNo companyName role image");
      //.select("-password");

    res.status(200).json({
      message: "success",
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch {
    res.status(500).json({ message: "GET USERS FAILED" });
  }
};

const getUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });

  } catch {
    res.status(500).json({ message: "GET USER FAILED" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });

  } catch {
    res.status(500).json({ message: "GET CURRENT USER FAILED" });
  }
};


const updateUser = async (req, res) => {
  try {
    console.log("here=====>?????",req.body)
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imageUrl = user.image;

    if (req.file && req.file.path) {
      try {
        const result = await uploadOnCloudinary(req.file.path);

        if (!result || !result.secure_url) {


          return res.status(500).json({ message: "Cloudinary upload failed" });
        }

        imageUrl = result.secure_url;

      } catch (err) {
        console.error("Cloudinary Error:", err);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const updateData = {
      ...(req.body.firstName && { firstName: req.body.firstName }),
      ...(req.body.lastName && { lastName: req.body.lastName }),
      ...(req.body.phoneNo && { phoneNo: req.body.phoneNo }),
      ...(req.body.companyName && { companyName: req.body.companyName }),
      image: imageUrl
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const removeProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.image = "";
    await user.save();

    res.status(200).json({
      message: "Profile image removed",
      data: user
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });

  } catch {
    res.status(500).json({ message: "DELETE FAILED" });
  }
};

const searchUser = async (req, res) => {
  try {
    const search = req.query.search || "";

    const users = await User.find({
      $or: [
  {
    firstName: {
      $regex: search,
      $options: "i"
    }
  },
  {
    lastName: {
      $regex: search,
      $options: "i"
    }
  },
  {
    $expr: {
      $regexMatch: {
        input: {
          $concat: ["$firstName", " ", "$lastName"]
        },
        regex: search,
        options: "i"
      }
    }
  },
  {
    email: {
      $regex: search,
      $options: "i"
    }
  },
  {
    companyName: {
      $regex: search,
      $options: "i"
    }
  },
  {
    role: {
      $regex: search,
      $options: "i"
    }
   }
  ]
    }).select("firstName lastName email phoneNo companyName role image");

    res.status(200).json({
      message: "success",
      data: users
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "SEARCH FAILED"
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await bcrypt.compare(req.body.oldPassword, user.password))) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });

  } catch {
    res.status(500).json({ message: "Error updating password" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = Math.random().toString(36).substring(2) + Date.now();

    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;


    await user.save();

    const url = `http://localhost:5173/reset-password/${token}`;

    await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sharmaprachi2503@gmail.com",
        pass: "oiclyagahfgjnxyj"
      }
    }).sendMail({
      from: "sharmaprachi2503@gmail.com",
      to: user.email,
      subject: "Password Reset",
      html: `<a href="${url}">${url}</a>`
    });

    res.status(200).json({ message: "Reset link sent" });

  } catch {
    res.status(500).json({ message: "Forgot password failed" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });

  } catch {
    res.status(500).json({ message: "Reset failed" });
  }
};

module.exports = {
  loginUsers,
  sendOtp,
  verifyOtp,
  createUser,
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  deleteUser,
  changePassword,
  forgotPassword,
  resetPassword,
  removeProfileImage,
  searchUser
};