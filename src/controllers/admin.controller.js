import User from "../models/user.model.js";
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
