import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
    unique: true,
  },
  parentCategory: {
    type: ObjectId,
    ref: "Category",
    default: null, // Dla głównych kategorii będzie null, dla podkategorii referencja do kategorii nadrzędnej
  },
});

export default mongoose.model("Category", categorySchema);
