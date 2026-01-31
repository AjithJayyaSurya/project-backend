import User from "../models/user.model.js";

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
