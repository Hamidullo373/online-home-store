import { isValidObjectId } from "mongoose";
import categoryModel from "../models/category.model.js";
import homesModel from "../models/homes.model.js";

const getAllHomes = async (req, res) => {
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
    res.status(500).send({
      message: "Error while fetching homes",
      error: error.message,
    });
  }
};

const getOneHomes = async (req, res) => {
  const { id } = req.params;

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).send({
        message: `Given ID: ${id} is not a valid Object ID`,
      });
    }

    const Homes = await homesModel
      .findById(id)
      .populate("category", "-homes -createdAt -updatedAt")
      .select(["-createdAt", "-updatedAt"]);

    if (!homes) {
      return res.status(404).send({
        message: "Homes not found",
      });
    }

    res.send({
      message: "success",
      data: homes,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error while fetching the Homes",
      error: error.message,
    });
  }
};

const createHomes = async (req, res) => {
  const { name, price, category, description, imageUrl } = req.body;

  try {
    const foundedCategory = await categoryModel.findById(category);

    if (!foundedCategory) {
      return res.status(404).send({
        message: `Category with ID: ${category} not found`,
      });
    }

    const homes = await homesModel.create({
      name,
      price,
      category,
      description,
      imageUrl,
    });

    await categoryModel.updateOne(
      { _id: category },
      {
        $push: {
          homes: homes._id,
        },
      }
    );

    res.status(201).send({
      message: "Homes created successfully",
      data: homes,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error while creating homes",
      error: error.message,
    });
  }
};

const updateHomes = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).send({
        message: `Given ID: ${id} is not a valid Object ID`,
      });
    }

    const homes = await homesModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
      },
      { new: true }
    );

    if (!homes) {
      return res.status(404).send({
        message: "Homes not found",
      });
    }

    res.send({
      message: "Homes updated successfully",
      data: homes,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error while updating homes",
      error: error.message,
    });
  }
};

const deleteHomes = async (req, res) => {
  const { id } = req.params;

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).send({
        message: `Given ID: ${id} is not a valid Object ID`,
      });
    }

    const result = await homesModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        message: "Homes not found",
      });
    }

    res.status(204).send({
      message: "Homes deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error while deleting homes",
      error: error.message,
    });
  }
};

export default {
  getAllHomes,
  getOneHomes,
  createHomes,
  updateHomes,
  deleteHomes,
};
