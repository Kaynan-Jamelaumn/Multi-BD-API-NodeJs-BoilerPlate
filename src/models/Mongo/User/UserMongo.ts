// src/models/Mongo/User/UserMongo

import mongoose, { Document, Model, Schema } from "mongoose";
import { MongoModel, MongoModelType } from "../../../types/models";
import bcrypt from "bcrypt";

// Define the interface for the User document
export interface IUser extends MongoModel {
  username: string;
  name: string;
  surname: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
  password: string;
  bio?: string;
  profilePicture: string;
  birthDate?: Date;
  isActive: boolean;
  role: "User" | "Admin";
  comparePassword(inputPassword: string): Promise<boolean>;
}

// Define the schema
const userSchema: Schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
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
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
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
    default: null,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"],
  },
  bio: {
    type: String,
    trim: true,
  },
  profilePicture: {
    type: String,
    default: "default-profile.jpg",
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
});

// Middleware to hash the password before saving
userSchema.pre<IUser & Document>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Middleware to update the `updatedAt` field before saving
userSchema.pre<IUser & Document>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  this: IUser & Document,
  inputPassword: string
): Promise<boolean> {
  return await bcrypt.compare(inputPassword, this.password);
};

// Create or retrieve the model
const UserMongo: MongoModelType =
  (mongoose.models.User as MongoModelType) ||
  mongoose.model<IUser & Document>("User", userSchema);

export default UserMongo;