// src/components/Header.jsx
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>Błąd</h1>;
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <ProductCarousel />
        <div className="xl:block lg:hidden md:hidden sm:hidden w-full mt-1">
          <div className="grid grid-cols-4 gap-0.125 justify-items-center">
            {data.map((product) => (
              <div key={product._id} className="flex justify-center">
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;