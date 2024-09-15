import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Message from "./Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import 'moment/locale/pl.js'; 
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";

moment.locale('pl');

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Losowanie 4 ofert do wyświetlenia nad karuzelą
  const topOffers = products.slice(0, 4);

  return (
    <div className="mb-4">
      {/* Renderowanie 4 małych ofert nad karuzelą */}
      <div className="grid grid-cols-4 gap-4 mb-8 max-w-full">
        {topOffers.map(({ image, _id, name, price }) => (
          <div key={_id} className="bg-gray-800 rounded-lg p-4 shadow-md text-white hover:bg-gray-700 cursor-pointer transition duration-300 ease-in-out">
            <img src={image} alt={name} className="h-24 w-full object-cover rounded-md" />
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-sm">ZŁ {price}</p>
          </div>
        ))}
      </div>

      {/* Karuzela */}
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="xl:w-[50rem] mx-auto">
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id}>
                <img
                  src={image}
                  alt={name}
                  className="w-full rounded-lg object-cover h-[30rem]"
                />

                <div className="mt-4 flex justify-between text-white">
                  <div>
                    <h2>{name}</h2>
                    <p> ZŁ {price}</p>
                    <p className="w-[25rem]">
                      {description.substring(0, 170)} ...
                    </p>
                  </div>

                  <div className="flex justify-between w-[20rem]">
                    <div>
                      <h1 className="flex items-center mb-6">
                        <FaStore className="mr-2 text-white" /> Marka: {brand}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaClock className="mr-2 text-white" /> Dodany: {moment(createdAt).fromNow()}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaStar className="mr-2 text-white" /> Opinie: {numReviews}
                      </h1>
                    </div>

                    <div>
                      <h1 className="flex items-center mb-6">
                        <FaStar className="mr-2 text-white" /> Oceny: {Math.round(rating)}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaShoppingCart className="mr-2 text-white" /> Ilość: {quantity}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaBox className="mr-2 text-white" /> W magazynie: {countInStock}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}

      {/* Produkty specjalne pod karuzelą */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">Produkty specjalne</h2>
        {/* Renderowanie produktów specjalnych */}
        <div className="grid grid-cols-4 gap-4">
          {products.map(({ image, _id, name, price }) => (
            <div key={_id} className="bg-gray-800 rounded-lg p-4 shadow-md text-white hover:bg-gray-700 cursor-pointer transition duration-300 ease-in-out">
              <img src={image} alt={name} className="h-24 w-full object-cover rounded-md" />
              <h2 className="text-lg font-semibold">{name}</h2>
              <p className="text-sm">ZŁ {price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
