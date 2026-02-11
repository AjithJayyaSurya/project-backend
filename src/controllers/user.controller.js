import User from "../models/user.model.js";
import Message from "../models/message.model.js";

// ✅ GET quota
export const getQuota = async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    quota: user.quota,
    usedQuota: user.usedQuota,
    expiry: user.quotaExpiry
  });
};

// ✅ PUT use quota
export const useQuota = async (req, res) => {
  const user = await User.findById(req.user.id);

  // ⏳ Expiry check
  if (new Date() > user.quotaExpiry) {
    return res.status(403).json({ message: "Account expired" });
  }

  // 🔁 Auto reset
  if (new Date() > user.quotaResetAt) {
    user.quota = 5;
    user.usedQuota = 0;
    user.quotaResetAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  // 🚫 Quota exceeded
  if (user.quota <= 0) {
    return res.status(403).json({ message: "Quota exceeded" });
  }

  // ✅ Consume
  user.quota -= 1;
  user.usedQuota += 1;

  user.usageLogs.push({
    action: "USE_QUOTA",
    time: new Date()
  });

  await user.save();

  res.json({
    message: "Quota used successfully",
    remainingQuota: user.quota
  });
};

// ✅ POST reset quota
export const resetQuota = async (req, res) => {
  const user = await User.findById(req.user.id);

  user.quota = 5;
  user.usedQuota = 0;
  user.quotaResetAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await user.save();

  res.json({ message: "Quota reset successfully" });
};

// ✅ DELETE logs
export const clearLogs = async (req, res) => {
  const user = await User.findById(req.user.id);

  user.usageLogs = [];
  await user.save();

  res.json({ message: "Usage logs cleared" });
};

// ✅ POST send message (consumes quota)
export const sendMessage = async (req, res) => {
  const { content } = req.body;
  const user = await User.findById(req.user.id);

  // ⏳ Expiry check
  if (new Date() > user.quotaExpiry) {
    return res.status(403).json({ message: "Account expired" });
  }

  // 🔁 Auto reset
  if (new Date() > user.quotaResetAt) {
    user.quota = 5;
    user.usedQuota = 0;
    user.quotaResetAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  // 🚫 Quota exceeded
  if (user.quota <= 0) {
    return res.status(403).json({ message: "Quota exceeded. Cannot send message." });
  }

  // ✅ Consume quota and create message
  user.quota -= 1;
  user.usedQuota += 1;

  user.usageLogs.push({
    action: "SEND_MESSAGE",
    time: new Date()
  });

  await user.save();

  const message = await Message.create({
    sender: user._id,
    content,
    status: "pending"
  });

  res.status(201).json({
    message: "Message sent successfully",
    remainingQuota: user.quota,
    data: message
  });
};

// ✅ GET my messages
export const getMyMessages = async (req, res) => {
  const messages = await Message.find({ sender: req.user.id }).sort({ timestamp: -1 });
  res.json(messages);
};

// ✅ DELETE message (reverts quota)
export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const user = await User.findById(req.user.id);

  const message = await Message.findOne({ _id: messageId, sender: user._id });
  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  // Revert quota
  user.quota += 1;
  user.usedQuota -= 1;

  user.usageLogs.push({
    action: "DELETE_MESSAGE",
    time: new Date()
  });

  await user.save();
  await Message.findByIdAndDelete(messageId);

  res.json({
    message: "Message deleted and quota reverted",
    remainingQuota: user.quota
  });
};
