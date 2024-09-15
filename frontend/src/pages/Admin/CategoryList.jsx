// src/pages/Admin/CategoryList.jsx

import React, { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const CategoryList = () => {
  const { data: categories = [], isLoading, error, refetch } = useFetchCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState("");

  // Stan dla edycji kategorii
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedCategoryName, setUpdatedCategoryName] = useState("");

  const buildCategoryTree = (categories) => {
    const categoryMap = {};
    const roots = [];

    // Tworzymy kopie obiektów kategorii i inicjalizujemy 'children'
    categories.forEach((category) => {
      const categoryCopy = { ...category, children: [] };
      categoryMap[categoryCopy._id.toString()] = categoryCopy;
    });

    // Budujemy drzewo
    Object.values(categoryMap).forEach((category) => {
      if (category.parentCategory) {
        let parentId = category.parentCategory;

        // Sprawdzamy, czy parentCategory jest obiektem
        if (typeof parentId === 'object' && parentId !== null) {
          parentId = parentId._id ? parentId._id.toString() : null;
        } else {
          parentId = parentId.toString();
        }

        const parent = categoryMap[parentId];
        if (parent) {
          parent.children.push(category);
        } else {
          roots.push(category);
        }
      } else {
        roots.push(category);
      }
    });

    // Sortujemy dzieci każdej kategorii rekurencyjnie
    const sortCategories = (categories) => {
      categories.sort((a, b) => a.name.localeCompare(b.name));
      categories.forEach((category) => {
        if (category.children && category.children.length > 0) {
          sortCategories(category.children);
        }
      });
    };

    // Sortujemy kategorie najwyższego poziomu
    sortCategories(roots);

    return roots;
  };

  const renderCategories = (categories, level = 0) => {
    return categories.map((category) => (
      <li key={category._id}>
        <div
          className="flex justify-between items-center border-b border-gray-200 py-3"
          style={{ paddingLeft: `${level * 20}px` }}
        >
          <button
            className="text-lg font-semibold text-gray-800 hover:underline focus:outline-none"
            onClick={() => handleEditCategory(category)}
            style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            {category.name}
          </button>
          <button
            className="text-red-500 hover:text-red-700 font-semibold"
            onClick={() => handleDeleteCategory(category._id)}
          >
            Usuń
          </button>
        </div>
        {category.children && category.children.length > 0 && (
          <ul>{renderCategories(category.children, level + 1)}</ul>
        )}
      </li>
    ));
  };

  const handleCreateCategory = async () => {
    if (newCategoryName) {
      const categoryData = { name: newCategoryName };
      if (parentCategory && parentCategory !== "") {
        categoryData.parentCategory = parentCategory;
      } else {
        categoryData.parentCategory = null;
      }
      try {
        await createCategory(categoryData).unwrap();
        setNewCategoryName("");
        setParentCategory("");
        refetch();
      } catch (error) {
        console.error("Błąd podczas tworzenia kategorii:", error);
      }
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setUpdatedCategoryName(category.name);
  };

  const handleUpdateCategory = async () => {
    if (updatedCategoryName && editingCategory) {
      try {
        await updateCategory({
          categoryId: editingCategory._id,
          updatedCategory: { name: updatedCategoryName },
        }).unwrap();
        setEditingCategory(null);
        setUpdatedCategoryName("");
        refetch();
      } catch (error) {
        console.error("Błąd podczas aktualizacji kategorii:", error);
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId).unwrap();
      console.log("Kategoria usunięta:", categoryId);
      refetch();
    } catch (error) {
      console.error("Błąd podczas usuwania kategorii:", error);
    }
  };

  // Budujemy drzewo kategorii z oryginalnej listy
  const categoryTree = buildCategoryTree(categories);

  return (
    <div className="admin-panel flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Lista Kategorii
        </h1>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message}</Message>
        ) : (
          <>
            <ul className="category-list mb-6">{renderCategories(categoryTree)}</ul>

            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Dodaj nową kategorię
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nazwa kategorii"
                className="w-full md:w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                className="w-full md:w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Bez kategorii nadrzędnej</option>
                {categories
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>

              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleCreateCategory}
              >
                Dodaj
              </button>
            </div>
          </>
        )}

        {/* Modal do edycji kategorii */}
        {editingCategory && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-blue-500 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Edytuj kategorię</h2>
              <input
                type="text"
                value={updatedCategoryName}
                onChange={(e) => setUpdatedCategoryName(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <div className="flex justify-end">
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg mr-2"
                  onClick={() => setEditingCategory(null)}
                >
                  Anuluj
                </button>
                <button
                  className="bg-blue-700 hover:bg-blue-600 text-red-500 hover:text-red-700 font-semibold"
                  onClick={handleUpdateCategory}
                >
                  Aktualizuj
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
