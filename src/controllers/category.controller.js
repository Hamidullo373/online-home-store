import { isValidObjectId } from "mongoose";
import categoryModel from "../models/category.model.js";

const getAllCategories = async (req, res) => {
  const { limit, page, sortField = "createdAt", sortOrder = "asc" } = req.query;
  const categories = await categoryModel
    .find({ categoryId: null })
    .populate("children")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort([[sortField, sortOrder]]);

  res.send({
    message: "seucess",
    data: categories,
  });
};

const getCategorybyId = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(404).send({
      message: `id notogri kiritilgan`,
    });
  }

  const category = await categoryModel.findById(id);

  if (!category) {
    res.send({
      message: "Berilgan id boyicha category topilmadi",
    });
  }

  res.send({
    message: "success",
    data: category,
  });
};

const createCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    // 1️⃣ Kategoriya allaqachon mavjudligini tekshiramiz
    const foundedCategory = await categoryModel.findOne({ name });

    if (foundedCategory) {
      return res.status(409).json({
        message: `Category: ${name} allaqachon mavjud`,
      });
    }

    // 2️⃣ `categoryId` berilgan bo‘lsa, u mavjudligini tekshiramiz
    if (categoryId) {
      const parentCategory = await categoryModel.findById(categoryId);
      if (!parentCategory) {
        return res.status(400).json({
          message: `categoryId: ${categoryId} bo‘lgan kategoriya topilmadi`,
        });
      }
    }

    // 3️⃣ Yangi kategoriyani yaratamiz (asosiy yoki subkategoriya bo‘lishi mumkin)
    const category = await categoryModel.create({
      name,
      categoryId: categoryId || null, // Agar yo‘q bo‘lsa, `null` saqlanadi
    });

    if (categoryId) {
      await categoryModel.updateOne(
        { _id: categoryId },
        {
          $push: {
            children: category._id,
          },
        }
      );
    }

    res.status(201).json({
      message: "Kategoriya muvaffaqiyatli yaratildi!",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Xatolik yuz berdi",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!isValidObjectId(id)) {
    return res.status(400).send({
      message: `id notogri kiritilgan`,
    });
  }

  const foundedCategory = await categoryModel.findOne({ name });

  if (foundedCategory) {
    return res.status(404).send({
      message: `Bunday nomdagi category allaqachon mavjud`,
    });
  }

  const updateCategory = await categoryModel.findByIdAndUpdate(id, { name });

  if (!updateCategory) {
    return res.status(404).send({
      message: `Bunday id li malumot topilmadi`,
    });
  }

  res.send({
    message: "success",
    data: updateCategory,
  });
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).send({
      message: `id notogri kiritilgan`,
    });
  }

  const deletedCategory = await categoryModel.findByIdAndDelete(id);

  res.send({
    message: "o'chirildi",
    data: deletedCategory,
  });
};

export default {
  getAllCategories,
  createCategory,
  getCategorybyId,
  updateCategory,
  deleteCategory,
};
