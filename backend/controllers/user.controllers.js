import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const authUserId = req.user._id;
    const users = await User.find({ _id: { $ne: authUserId } }).select("-password")
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", err });
  }
};
