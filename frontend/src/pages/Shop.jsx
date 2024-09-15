import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import CategorySelect from "../components/CategorySelect";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const { data: filteredProductsData = [], isLoading: isProductsLoading } =
    useGetFilteredProductsQuery({
      checked,
      radio,
    });

  const [priceFilter, setPriceFilter] = useState("");

  useEffect(() => {
    if (!isProductsLoading) {
      // Filtruj produkty na podstawie wybranych kategorii i filtra ceny
      const filteredProducts = filteredProductsData.filter((product) => {
        return (
          product.price.toString().includes(priceFilter) ||
          product.price === parseInt(priceFilter, 10)
        );
      });

      dispatch(setProducts(filteredProducts));
    }
  }, [filteredProductsData, dispatch, priceFilter, isProductsLoading]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsData.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
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

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="flex md:flex-row">
          <div className="bg-[#151515] p-3 mt-2 mb-2">
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
                    className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ml-2 text-sm font-medium text-white dark:text-gray-300">
                    {brand}
                  </label>
                </div>
              ))}
            </div>

            <div className="filter-section">
  <h2>Filtruj według ceny</h2>
  <input
    type="text"
    placeholder="Wprowadź cenę"
    value={priceFilter}
    onChange={handlePriceChange}
    className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
  />
</div>


            <div className="p-5 pt-0">
              <button
                className="w-full border my-4"
                onClick={() => window.location.reload()}
              >
                Resetowanie
              </button>
            </div>
          </div>

          <div className="p-3">
            <h2 className="h4 text-center mb-2">{products?.length} Produkty</h2>
            <div className="flex flex-wrap">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products.map((p) => (
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
