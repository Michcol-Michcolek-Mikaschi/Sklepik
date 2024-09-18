import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import {
  setCategories,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import CategorySelect from "../components/CategorySelect";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, checked, radio } = useSelector(
    (state) => state.shop
  );

  const { data: filteredProductsData = [], isLoading: isProductsLoading } =
    useGetFilteredProductsQuery({
      checked,
      radio,
    });

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  useEffect(() => {
    if (!isProductsLoading) {
      // Filtruj produkty na podstawie wybranych kategorii, marki i zakresu cen
      let filtered = filteredProductsData;

      // Filtruj po marce
      if (selectedBrand !== "") {
        filtered = filtered.filter(
          (product) => product.brand === selectedBrand
        );
      }

      // Filtruj po cenie od
      if (priceFrom !== "") {
        filtered = filtered.filter(
          (product) => product.price >= parseFloat(priceFrom)
        );
      }

      // Filtruj po cenie do
      if (priceTo !== "") {
        filtered = filtered.filter(
          (product) => product.price <= parseFloat(priceTo)
        );
      }

      setFilteredProducts(filtered);
    }
  }, [
    filteredProductsData,
    selectedBrand,
    priceFrom,
    priceTo,
    isProductsLoading,
  ]);

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...new Set(
      filteredProductsData.map((product) => product.brand).filter(Boolean)
    ),
  ];

  return (
    <>
      <div className="container mx-auto">
        <div className="flex md:flex-row">
          <div className="bg-[#151515] p-3 mt-2 mb-2 ">
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filtruj według kategorii
            </h2>

            <CategorySelect
              onCategorySelect={(selectedCategory) =>
                handleCheck(true, selectedCategory)
              }
            />

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filtruj według marek
            </h2>

            <div className="p-5">
              {uniqueBrands.map((brand) => (
                <div key={brand} className="flex items-center mr-4 mb-5">
                  <input
                    type="radio"
                    name="brand"
                    onChange={() => handleBrandClick(brand)}
                    checked={selectedBrand === brand}
                    className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500"
                  />
                  <label className="ml-2 text-sm font-medium text-white">
                    {brand}
                  </label>
                </div>
              ))}
              {/* Opcja resetowania wyboru marki */}
              <div className="flex items-center mr-4 mb-5">
                <input
                  type="radio"
                  name="brand"
                  onChange={() => handleBrandClick("")}
                  checked={selectedBrand === ""}
                  className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500"
                />
                <label className="ml-2 text-sm font-medium text-white">
                  Wszystkie marki
                </label>
              </div>
            </div>

            <div className="filter-section">
              <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
                Filtruj według ceny
              </h2>
              <div className="p-5">
                <input
                  type="number"
                  placeholder="Cena od"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  className="w-full px-3 py-2 mb-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
                />
                <input
                  type="number"
                  placeholder="Cena do"
                  value={priceTo}
                  onChange={(e) => setPriceTo(e.target.value)}
                  className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
                />
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full border my-4"
                onClick={() => {
                  setPriceFrom("");
                  setPriceTo("");
                  setSelectedBrand("");
                  dispatch(setChecked([]));
                }}
              >
                Resetowanie
              </button>
            </div>
          </div>

          <div className="p-3">
            <h2 className="h4 text-center mb-2">
              {filteredProducts.length} Produkty
            </h2>
            {isProductsLoading ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
                {filteredProducts.length === 0 ? (
                  <p className="text-white">
                    Brak produktów spełniających kryteria.
                  </p>
                ) : (
                  filteredProducts.map((p) => (
                    <div className="p-3" key={p._id}>
                      <ProductCard p={p} />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
