import React from "react";
import { useParams } from "react-router-dom";
import { useGetProductDetails } from "../../../hooks/products/useGetProductDetails";
import "swiper/css/effect-cube";
import "swiper/css/effect-coverflow";

import "swiper/css/pagination";
// Import Swiper styles
import "swiper/css";
import { EffectCube, EffectCoverflow, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { BASE_URL } from "../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useAddToCart } from "../../../hooks/cart/useAddToCart";
import { addItem } from "../../../store/cartSlice";
import Button from "../../../components/UI/Button";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useUserData } from "../../../hooks/auth/useUserData";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { data, error, isLoading, isError } = useGetProductDetails(productId);
  const addToCartMutation = useAddToCart();
  const { userData } = useUserData();

  const product = data;
  const addToCart = () => {
    console.log("isLoggedIn", userData?.id);
    if (userData?.id) {
      addToCartMutation.mutate({ productId, quantity: 1 });
    } else {
      console.log("addToCart");
      dispatch(addItem({ productId, quantity: 1 }));
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        {error.message}
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 lg:px-20 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={true}
            modules={[EffectCoverflow, Pagination]}
          >
            {product?.imgs.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={`${BASE_URL}/` + img}
                  alt={product.name}
                  className="object-cover w-full h-96 rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="flex flex-col justify-start mt-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">{product?.name}</h2>
            <p className="text-lg text-gray-700 mb-4">{product?.description}</p>
            <p className="text-gray-600 mb-3">
              Category:{" "}
              <span className="text-gray-800 font-semibold">
                {product?.category}
              </span>
            </p>
            <p className="text-gray-600">
              Price:{" "}
              <span className="text-green-600 font-bold">
                ${product?.price}
              </span>
            </p>
          </div>
          <Button
            isDisabled={addToCartMutation.isPending}
            onClick={addToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-start"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
