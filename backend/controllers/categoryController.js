import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    if (!name) {
      return res.json({ error: "Nazwa jest wymagana" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.json({ error: "Kategoria już istnieje" });
    }

    const category = new Category({ name, parentCategory });
    await category.save();
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});


const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name, parentCategory } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Kategoria nie znaleziona" });
    }

    category.name = name || category.name;
    category.parentCategory = parentCategory || category.parentCategory;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd wewnętrzny serwera" });
  }
});

const removeCategory = asyncHandler(async (req, res) => {
  try {
    // Znalezienie kategorii do usunięcia
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ error: "Kategoria nie znaleziona" });
    }

    // Usunięcie wszystkich podkategorii
    await Category.deleteMany({ parentCategory: category._id });

    // Usunięcie samej kategorii
    const removedCategory = await Category.findByIdAndRemove(req.params.categoryId);
    
    res.json({ message: "Kategoria oraz podkategorie zostały usunięte", removedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd wewnętrzny serwera" });
  }
});

const listCategory = asyncHandler(async (req, res) => {
  try {
    // Znajdowanie wszystkich kategorii i zagnieżdżonych podkategorii
    const all = await Category.find({}).populate('parentCategory');
    res.json(all);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});


const readCategory = asyncHandler(async (req, res) => {
  try {
    // Znalezienie kategorii oraz jej nadrzędnej kategorii
    const category = await Category.findById(req.params.id).populate('parentCategory');
    if (!category) {
      return res.status(404).json({ error: "Kategoria nie znaleziona" });
    }
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});


export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};
