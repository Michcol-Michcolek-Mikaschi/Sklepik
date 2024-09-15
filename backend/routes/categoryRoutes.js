import express from "express";
const router = express.Router();
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, authorizeAdmin, createCategory);
router.route("/:categoryId").put(authenticate, authorizeAdmin, updateCategory);
router
  .route("/:categoryId")
  .delete(authenticate, authorizeAdmin, removeCategory);

router.route("/categories").get(listCategory);
router.route("/:id").get(readCategory);

router.route("/main-categories").get(async (req, res) => {
  try {
    const mainCategories = await Category.find({ parentCategory: null });
    res.json(mainCategories);
  } catch (error) {
    res.status(500).json({ error: "Nie udało się pobrać głównych kategorii" });
  }
});

router.route("/subcategories/:mainCategoryId").get(async (req, res) => {
  try {
    const subCategories = await Category.find({ parentCategory: req.params.mainCategoryId });
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ error: "Nie udało się pobrać podkategorii" });
  }
});
export default router;
