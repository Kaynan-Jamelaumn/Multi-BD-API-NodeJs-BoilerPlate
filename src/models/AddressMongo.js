import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
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
addressSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const AddressMongo = mongoose.models.Address || mongoose.model("Address", addressSchema);
export default AddressMongo;
