const mongoose = require('mongoose');

// Schema for Student / User
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    rollNumber: {
      type: String,
      default: ''
    },
    branch: {
      type: String,
      default: 'Information Technology'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
