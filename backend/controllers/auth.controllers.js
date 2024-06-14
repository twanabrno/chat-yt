import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { username, fullName, password, confirmPassword, gender } = req.body;
    if (!password || !confirmPassword || password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    if (password.length <= 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // HASH THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // https://avatar-placeholder.iran.liara.run/
    const boyProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePicture = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      username,
      fullName,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePicture : girlProfilePicture,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        gender: newUser.gender,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(500).json({ error: "Invalid Data" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", err });
  }
};
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      gender: user.gender,
      profilePic: user.profilePic,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", err });
  }
};
export const logout =  (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", err });
  }
};
