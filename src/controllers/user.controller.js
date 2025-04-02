import { isValidObjectId } from "mongoose";
import userModel from "../models/user.model.js";

const getAllUsers = async (_, res) => {
  try {
    const users = await userModel.find();
    res.send({ data: users, message: "All users fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ message: `Given user ID: ${id} is not valid` });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: `User with ID: ${id} not found` });
    }

    res.json({ data: user, message: "User fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, phoneNumber, password } = req.body;

    if (!username || typeof username !== "string" || !username.trim()) {
      return res
        .status(400)
        .json({ message: "Username must be a non-empty string" });
    }
    if (
      !phoneNumber ||
      typeof phoneNumber !== "string" ||
      !phoneNumber.trim()
    ) {
      return res
        .status(400)
        .json({ message: "Phone number must be a non-empty string" });
    }
    if (!password || typeof password !== "string" || !password.trim()) {
      return res
        .status(400)
        .json({ message: "Password must be a non-empty string" });
    }

    // if (!email || typeof email !== "string" || !email.trim()) {
    //     return res.status(400).json({ message: "Email must be a non-empty string" });
    // }

    const newUser = new userModel({ username, phoneNumber, password });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ message: `Given user ID: ${id} is not valid` });
    }

    const { username, phoneNumber, password } = req.body;
    const updatedFields = {};

    if (username !== undefined) {
      if (typeof username !== "string" || !username.trim()) {
        return res
          .status(400)
          .json({ message: "Username must be a non-empty string" });
      }
      updatedFields.username = username;
    }
    if (phoneNumber !== undefined) {
      if (typeof phoneNumber !== "string" || !phoneNumber.trim()) {
        return res
          .status(400)
          .json({ message: "Phone number must be a non-empty string" });
      }
      updatedFields.phoneNumber = phoneNumber;
    }
    if (password !== undefined) {
      if (typeof password !== "string" || !password.trim()) {
        return res
          .status(400)
          .json({ message: "Password must be a non-empty string" });
      }
      updatedFields.password = password;
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: `User with ID: ${id} not found` });
    }

    res.json({ data: updatedUser, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ message: `Given user ID: ${id} is not valid` });
    }

    const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: `User with ID: ${id} not found` });
    }

    res.json({ data: deletedUser, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UserController = {
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
};
export default UserController;
