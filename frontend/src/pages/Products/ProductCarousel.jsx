import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import 'moment/locale/pl.js'; 
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

moment.locale('pl');

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <FaChevronRight
      className={className}
      style={{ ...style, display: "block", color: "white", fontSize: "2rem" }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <FaChevronLeft
      className={className}
      style={{ ...style, display: "block", color: "white", fontSize: "2rem" }}
      onClick={onClick}
    />
  );
};

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
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="mb-4">
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
                  className="w-full rounded-lg object-cover h-64"
                />

                <div className="mt-4 flex flex-wrap justify-between">
                  <div className="text-white">
                    <h2>{name}</h2>
                    <p>ZŁ {price}</p>
                    <p className="w-full sm:w-[25rem] mt-4">
                      {description.substring(0, 170)} ...
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-between w-full sm:w-[20rem] text-white mt-4 sm:mt-0">
                    <div className="one">
                      <h1 className="flex items-center mb-2">
                        <FaStore className="mr-2 text-white" /> Marka: {brand}
                      </h1>
                      <h1 className="flex items-center mb-2">
                        <FaClock className="mr-2 text-white" /> Dodany:{" "}
                        {moment(createdAt).fromNow()}
                      </h1>
                      <h1 className="flex items-center mb-2">
                        <FaStar className="mr-2 text-white" /> Opinie: {numReviews}
                      </h1>
                    </div>

                    <div className="two">
                      <h1 className="flex items-center mb-2">
                        <FaStar className="mr-2 text-white" /> Oceny:{" "}
                        {Math.round(rating)}
                      </h1>
                      <h1 className="flex items-center mb-2">
                        <FaShoppingCart className="mr-2 text-white" /> Ilość: {quantity}
                      </h1>
                      <h1 className="flex items-center mb-2">
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
    </div>
  );
};

export default ProductCarousel;
