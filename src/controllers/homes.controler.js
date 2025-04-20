import { isValidObjectId } from "mongoose";
import categoryModel from "../models/category.model.js";
import homesModel from "../models/homes.model.js";
import { BaseException } from "../exception/base.exseption.js";

const getAllHomes = async (req, res, next) => {
  try {
    const homes = await homesModel
      .find()
      .populate("category", "-homes -createdAt -updatedAt")
      .select(["-createdAt", "-updatedAt"]);

    res.send({
      message: "success",
      count: homes.length,
      data: homes,
    });
  } catch (error) {
    next(error);
  }
};

const getOneHomes = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new BaseException(`Given ID: ${id} is not valid Object ID`, 400);
    }

    const homes = await homesModel
      .findById(id)
      .populate("category", "-homes -createdAt -updatedAt")
      .select(["-createdAt", "-updatedAt"]);

    if (!homes) {
      throw new BaseException("Homes not found", 404);
    }

    res.send({
      message: "success",
      data: homes,
    });
  } catch (error) {
    next(error);
  }
};

const createHomes = async (req, res, next) => {
  try {
    const { name, price, location, category, description } = req.body;

    const foundedCategory = await categoryModel.findById(category);
    if (!foundedCategory) {
      throw new BaseException(`Category with ID: ${category} not found`, 400);
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const homes = await homesModel.create({
      name,
      price,
      location,
      category,
      description,
      imageUrl,
    });

    await categoryModel.updateOne(
      { _id: category },
      { $push: { homes: homes._id } }
    );

    res.status(201).send({
      message: "success",
      data: homes,
    });
  } catch (error) {
    next(error);
  }
};

const updateHomes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, location } = req.body;

    if (!isValidObjectId(id)) {
      throw new BaseException(`Given ID: ${id} is not valid Object ID`, 400);
    }

    const homes = await homesModel.findByIdAndUpdate(
      id,
      { name, description, price, location },
      { new: true }
    );

    if (!homes) {
      throw new BaseException("Homes not found", 404);
    }

    res.send({
      message: "Homes updated successfully",
      data: homes,
    });
  } catch (error) {
    next(error);
  }
};

const deleteHomes = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new BaseException(`Given ID: ${id} is not valid Object ID`, 400);
    }

    const result = await homesModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new BaseException("Homes not found", 404);
    }

    await categoryModel.updateOne({ homes: id }, { $pull: { homes: id } });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export default {
  getAllHomes,
  getOneHomes,
  createHomes,
  updateHomes,
  deleteHomes,
};
