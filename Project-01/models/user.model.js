const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      match: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{6,}$/,
        "Password must contain at least 6 characters, including uppercase, lowercase, number, and special character"
      ]
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    phoneNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpire: {
      type: Date
    },
    otp: {
      type: String
    },
    otpExpire: {
      type: Date
    },
    image: {
    type: String,
    default: ""
   }
    },
  
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);