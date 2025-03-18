// src/models/AddressMongo.ts

import mongoose, { Document, Model, Schema } from "mongoose";
import { MongoModel, MongoModelType } from "../types/models";

// Define the interface for the Address document
export interface IAddress extends MongoModel {
  userId: mongoose.Types.ObjectId;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const addressSchema: Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  street: {
    type: String,
    required: true,
    trim: true,
  },
  number: {
    type: String,
    required: true,
    trim: true,
  },
  complement: {
    type: String,
    trim: true,
  },
  neighborhood: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    default: "Brazil",
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the `updatedAt` field before saving
addressSchema.pre<IAddress>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create or retrieve the model
const AddressMongo: MongoModelType =
  (mongoose.models.Address as MongoModelType) ||
  mongoose.model<IAddress & Document>("Address", addressSchema);

export default AddressMongo;