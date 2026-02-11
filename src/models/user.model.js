import mongoose from "mongoose";

const usageLogSchema = new mongoose.Schema({
  action: String,
  time: Date
});

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER"
  },

  quota: {
    type: Number,
    default: 5
  },

  usedQuota: {
    type: Number,
    default: 0
  },

  quotaResetAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
  },

  quotaExpiry: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },

  usageLogs: [usageLogSchema]
});

export default mongoose.model("User", userSchema);
