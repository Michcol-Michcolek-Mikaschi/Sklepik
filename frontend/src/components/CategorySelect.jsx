// src/components/CategorySelect.jsx

import React, { useEffect, useState } from "react";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

const CategorySelect = ({ onCategorySelect }) => {
  const { data: categories = [], isLoading } = useFetchCategoriesQuery();
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (selectedCategoryId, level) => {
    const updatedSelectedCategories = [...selectedCategories];
    updatedSelectedCategories[level] = selectedCategoryId;
    // Usuwamy niższe poziomy
    updatedSelectedCategories.splice(level + 1);
    setSelectedCategories(updatedSelectedCategories);

    // Przekazujemy wszystkie wybrane kategorie do rodzica
    onCategorySelect(updatedSelectedCategories.filter(Boolean));
  };

  const getSubcategories = (parentId) => {
    return categories.filter(
      (category) =>
        category.parentCategory &&
        category.parentCategory.toString() === parentId.toString()
    );
  };

  const renderCategorySelectors = () => {
    const selectors = [];
    let currentParentId = null;

    for (let level = 0; ; level++) {
      const options = categories.filter(
        (category) =>
          (category.parentCategory
            ? category.parentCategory.toString()
            : null) ===
          (currentParentId ? currentParentId.toString() : null)
      );

      if (options.length === 0) break;

      selectors.push(
        <div key={level} className="mb-4">
          <label className="text-white">
            {level === 0 ? "Kategoria główna:" : "Podkategoria:"}
          </label>
          <select
            value={selectedCategories[level] || ""}
            onChange={(e) =>
              handleCategoryChange(e.target.value, level)
            }
            className="w-full px-3 py-2 mb-2 bg-gray-800 text-white border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
          >
            <option value="">Wybierz kategorię</option>
            {options.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      );

      const selectedCategoryId = selectedCategories[level];
      if (selectedCategoryId) {
        currentParentId = selectedCategoryId;
      } else {
        break;
      }
    }

    return selectors;
  };

  return (
    <div className="p-5">
      {isLoading ? (
        <p className="text-white">Ładowanie kategorii...</p>
      ) : (
        renderCategorySelectors()
      )}
    </div>
  );
};

export default CategorySelect;
