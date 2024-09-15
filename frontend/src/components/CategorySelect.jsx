import React, { useEffect, useState } from "react";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

const CategorySelect = ({ onCategorySelect }) => {
  const { data: categories = [], isLoading } = useFetchCategoriesQuery();
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (selectedMainCategory) {
      const mainCategory = categories.find(
        (category) => category._id === selectedMainCategory
      );
      setSubCategories(mainCategory?.subcategories || []);
    }
  }, [selectedMainCategory, categories]);

  const handleMainCategoryChange = (e) => {
    setSelectedMainCategory(e.target.value);
    onCategorySelect(e.target.value);
  };

  return (
    <div>
      <label>Kategoria główna:</label>
      <select value={selectedMainCategory} onChange={handleMainCategoryChange}>
        <option value="">Wybierz kategorię</option>
        {categories
          .filter((category) => !category.parentCategory)
          .map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
      </select>

      {subCategories.length > 0 && (
        <>
          <label>Podkategoria:</label>
          <select onChange={(e) => onCategorySelect(e.target.value)}>
            <option value="">Wybierz podkategorię</option>
            {subCategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default CategorySelect;
