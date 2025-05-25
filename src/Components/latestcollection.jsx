import React, { useEffect, useState } from "react";
import { useShop } from "../Context/shopcontext";
import Productitem from "./productitem";
import Title from "./Title";

const LatestCollection = () => {
  const { products, currency, addtocart } = useShop();
  const [latestproducts, setlatestproducts] = useState([]);

  useEffect(() => {
    setlatestproducts(products.slice(0, 10));
  }, [products]);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Title text1="Latest" text2="Collection" />
          <p className="w-3/4 m-auto text-base sm:text-lg text-gray-600 mt-6">
            Explore our newest arrivals featuring the latest trends and styles. 
            Stay ahead of fashion with our carefully curated selection of premium products.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {latestproducts.map((item, index) => (
            <div key={index} className="group transform transition-all duration-300 hover:-translate-y-2">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <Productitem
                    id={item._id}
                    name={item.name}
                    price={item.price}
                    image={item.image[0]}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">(85)</span>
                    </div>
                    <button className="text-sm text-gray-600 hover:text-black transition-colors">
                      Add to Wishlist
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Free Shipping</span>
                    <span className="text-sm text-green-600 font-medium">In Stock</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestCollection;
