import { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_SECRET,
  generateToken,
} from "../config/jwt.config.js"; // Import generateToken

// Register Controller
const register = async (req, res, next) => {
  try {
    const { name, phoneNumber, password, birthDate, gender } = req.body;

    // Check if all fields are provided
    if (!name || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const phoneRegex =
      /^\+998(9[012345789]|6[125679]|7[01234569]|3[3]|8[8]|2[0]|5[05])[0-9]{7}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Check if user already exists with the provided phone number
    const existingUser = await userModel.findOne({ phoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this phone number" });
    }

    // Hash the password before saving
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      phoneNumber,
      password: passwordHash,
      birthDate,
      gender,
    });

    // Save the new user
    await newUser.save();

    // Generate token after user registration
    const token = generateToken(
      newUser._id,
      newUser.phoneNumber,
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRE_TIME
    );

    // Send response with the user data and the token
    res
      .status(201)
      .json({ message: "User registered successfully", data: newUser, token });
  } catch (error) {
    console.error(error); // Log errors for debugging
    next(error); // Pass the error to the error-handling middleware
  }
};

// Login Controller
const login = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;

    // Check if both phone number and password are provided
    if (!phoneNumber || !password) {
      return res
        .status(400)
        .json({ message: "Phone number and password are required" });
    }

    // Find the user by phone number
    const user = await userModel.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token upon successful login
    const token = generateToken(user._id, user.phoneNumber);

    // Send response with the token
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error); // Log errors for debugging
    next(error); // Pass the error to the error-handling middleware
  }
};

// Get All Users Controller
const getAllUsers = async (_, res, next) => {
  try {
    const users = await userModel.find();
    res
      .status(200)
      .json({ data: users, message: "All users fetched successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get One User Controller
const getOneUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is valid
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ message: `Given user ID: ${id} is not valid` });
    }

    // Find the user by ID
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: `User with ID: ${id} not found` });
    }

    // Send response with user data
    res.status(200).json({ data: user, message: "User fetched successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Update User Controller
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is valid
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ message: `Given user ID: ${id} is not valid` });
    }

    // Update the user by ID
    const updatedUser = await userModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: `User with ID: ${id} not found` });
    }

    // Send response with updated user data
    res
      .status(200)
      .json({ data: updatedUser, message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Delete User Controller
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is valid
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ message: `Given user ID: ${id} is not valid` });
    }

    // Delete the user by ID
    const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: `User with ID: ${id} not found` });
    }

    // Send response after deletion
    res
      .status(200)
      .json({ data: deletedUser, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default {
  register,
  login,
  getAllUsers,
  getOneUser,
  deleteUser,
  updateUser,
};
