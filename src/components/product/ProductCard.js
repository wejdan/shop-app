import React, { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css/effect-cube";
import "swiper/css/pagination";
// Import Swiper styles
import "swiper/css";
import { EffectCube, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";

// install Swiper modules

const ProductCard = ({ product, onAddToCart }) => {
  const { name, price, category, imgs } = product;
  const [controlledSwiper, setControlledSwiper] = useState(null);
  return (
    <div className="max-w-sm bg-white rounded overflow-hidden shadow-md">
      {/* Swiper Container for Images */}
      <Swiper
        effect={"cube"}
        grabCursor={true}
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        }}
        pagination={true}
        modules={[EffectCube, Pagination]}
        navigation
        className="h-48"
      >
        {imgs.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={`${BASE_URL}/` + img}
              alt={`Product Image ${index + 1}`}
              className="w-full object-cover h-48"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="px-6 py-4 ">
        <div className="font-bold text-xl mb-2 truncate">{name}</div>
        <p className="text-gray-700 text-base">Price: ${price}</p>
        <p className="text-gray-700 text-base">Category: {category}</p>
      </div>
      <div className="px-6 pt-4 mb-6">
        <Link
          to={`/product/${product.id}`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
