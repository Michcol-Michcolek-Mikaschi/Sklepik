import React from 'react';
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
} from "react-icons/fa";
import '../styles/ProductCarousel.css';

moment.locale('pl');

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="product-carousel-container">
      <div className="offers">
        {products && products.slice(0, 4).map((product, index) => (
          <div key={index} className="offer">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
      <div className="carousel">
        {isLoading ? (
          <Message>Loading...</Message>
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product._id}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;