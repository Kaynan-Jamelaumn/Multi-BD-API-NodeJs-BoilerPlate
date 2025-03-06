import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true, // Removes unnecessary whitespace
  },
  surname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // Ensures emails are stored in lowercase
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // Basic email validation
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"], // Minimum password length
  },
  bio: {
    type: String,
    trim: true,
  },
  profilePicture: {
    type: String,
    default: "default-profile.jpg", // Default profile picture
  },
  birthDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
  lastLogin: {
    type: Date,
    default: null,
  },
});

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10); // Hash password with bcrypt
  }
  next();
});

// Middleware to update the `updatedAt` field before saving
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};


const UserMongo = mongoose.models.User || mongoose.model("User", userSchema);
export default UserMongo;