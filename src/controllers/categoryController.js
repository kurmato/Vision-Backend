import Category from "../models/Category.js";
import { saveImage, deleteImage } from "../services/imageService.js";

// Create a new category
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    let imageId = null;

    // With upload.single("image"), file is in req.file (not req.files)
    if (req.file) {
      const savedImage = await saveImage(req.file);
      console.log(savedImage, "savedImage");
      imageId = savedImage.id;
      console.log(imageId, "imageId");
    }

    const category = await Category.create({
      name,
      image: imageId,
    });

    // Include image URL in response
    let categoryData = category.toJSON();
    if (imageId) {
      const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
      categoryData.imageUrl = `${baseUrl}api/images/${imageId}`;
    } else {
      categoryData.imageUrl = null;
    }

    res.status(201).json({ success: true, data: categoryData });
  } catch (error) {
    next(error);
  }
};

// Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [["name", "ASC"]] });
    const baseUrl = process.env.BASE_URL || "http://localhost:3000/";

    const result = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      imageUrl: cat.image ? `${baseUrl}api/images/${cat.image}` : null,
      createdAt: cat.createdAt,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// Get category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
    const categoryData = category.toJSON();
    categoryData.imageUrl = category.image
      ? `${baseUrl}api/images/${category.image}`
      : null;

    res.json({ success: true, data: categoryData });
  } catch (error) {
    next(error);
  }
};

// Update category
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    let imageId = category.image;

    // With upload.single("image"), file is in req.file (not req.files)
    if (req.file) {
      // Delete old image if exists
      if (imageId) {
        await deleteImage(imageId);
      }

      // Save new image
      const savedImage = await saveImage(req.file);
      imageId = savedImage.id;
    }

    await category.update({ name, image: imageId });

    const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
    const categoryData = category.toJSON();
    categoryData.imageUrl = imageId ? `${baseUrl}api/images/${imageId}` : null;

    res.json({ success: true, data: categoryData });
  } catch (error) {
    next(error);
  }
};

// Delete category
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    // Delete associated image if exists
    if (category.image) {
      await deleteImage(category.image);
    }

    await category.destroy();
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};
