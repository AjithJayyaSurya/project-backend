import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import bcrypt from "bcryptjs";

// CREATE user with quota
export const createUserWithQuota = async (req, res) => {
  const { name, email, password, quota } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: "USER",
    quota,
    quotaResetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    quotaExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  res.status(201).json({ message: "User created with quota" });
};

// READ all users
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// DELETE user
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

// ✅ GET all messages
export const getAllMessages = async (req, res) => {
  const messages = await Message.find()
    .populate("sender", "name email")
    .sort({ timestamp: -1 });
  res.json(messages);
};

// ✅ PUT update message status (accept/reject)
export const updateMessageStatus = async (req, res) => {
  const { messageId } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status. Use 'accepted' or 'rejected'" });
  }

  const message = await Message.findByIdAndUpdate(
    messageId,
    { status },
    { new: true }
  ).populate("sender", "name email");

  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  res.json({
    message: `Message ${status} successfully`,
    data: message
  });
};

// ✅ PUT set user quota
export const setUserQuota = async (req, res) => {
  const { userId } = req.params;
  const { quota } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { quota },
    { new: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    message: "Quota updated successfully",
    data: user
  });
};
