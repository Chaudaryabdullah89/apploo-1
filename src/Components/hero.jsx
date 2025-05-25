import React from "react";
import { Link } from "react-router-dom";
import assets from "../assets/assets";

const Hero = () => {
  return (
    <div className="relative bg-gray-900 text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={assets.hero_img}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-32 md:py-48">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-12 h-[2px] bg-white"></div>
            <p className="text-lg font-medium tracking-wider">NEW COLLECTION</p>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Your Style
            <br />
            <span className="text-gray-300">Elevate Your Wardrobe</span>
          </h1>
          
          <p className="text-gray-300 text-lg mb-8 max-w-lg">
            Explore our latest collection of premium fashion items. 
            From casual to formal, we have everything you need to express your unique style.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/collection"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-black bg-white hover:bg-gray-100 transition-colors duration-300"
            >
              Shop Now
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white border border-white hover:bg-white hover:text-black transition-colors duration-300"
            >
              Learn More
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-gray-400">Brands</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">2k+</div>
              <div className="text-gray-400">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">30k+</div>
              <div className="text-gray-400">Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
