import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import RelatedProducts from "../Components/RelatedProducts";
import { useShop } from "../Context/shopcontext";
import { toast } from "react-toastify";

const Product = () => {
  const { productid } = useParams();
  const navigate = useNavigate();
  const { products, currency, addtocart, cartitems, updatequantity } = useShop();
  const [productdata, setproductdata] = useState(null);
  const [size, setsize] = useState('');

  const fetchproductdata = async () => {
    if (!products || !Array.isArray(products)) return;
    
    const foundProduct = products.find(item => item._id === productid);
    if (foundProduct) {
      setproductdata(foundProduct);
    }
  };

  useEffect(() => {
    fetchproductdata();
  }, [products, productid]);

  const handleBuyNow = () => {
    if (productdata?.sizes?.length > 0 && !size) {
      toast.error('Please select a size');
      return;
    }
    
    if (!productdata) return;
    
    // Clear existing cart items
    if (cartitems) {
      Object.keys(cartitems).forEach(productId => {
        Object.keys(cartitems[productId]).forEach(size => {
          updatequantity(productId, size, 0);
        });
      });
    }
    
    // Add the current item
    addtocart(productdata._id, size || 'default');
    
    // Store cart data in localStorage for checkout
    const cartData = {
      items: [{
        _id: productdata._id,
        name: productdata.name,
        price: productdata.price,
        image: productdata.image,
        size: size || 'default',
        quantity: 1
      }],
      subtotal: productdata.price,
      shipping: 10,
      tax: productdata.price * 0.1,
      total: productdata.price + 10 + (productdata.price * 0.1)
    };
    
    localStorage.setItem('checkoutData', JSON.stringify(cartData));
    navigate('/place-order');
  };

  const handleAddToCart = () => {
    if (productdata?.sizes?.length > 0 && !size) {
      toast.error('Please select a size');
      return;
    }
    if (!productdata) return;
    
    addtocart(productdata._id, size || 'default');
    toast.success('Item added to cart');
  };

  if (!productdata) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-10 text-center">
        <p className="text-gray-500">Product not found. Please try again later or check your internet connection.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-10">
      <div className="border-t-2 pt-10 transition-all ease-in duration-500 text-start">
        {/* product data */}
        <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
          {/* product images */}
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="w-full sm:w-[80%]">
              <img src={productdata.image} className="w-full h-auto" alt={productdata.name} />
            </div>
          </div>
          {/* product information */}
          <div className="flex-1">
            <h1 className="font-medium text-2xl mt-2 items-start text-start">
              {productdata.name}
            </h1>
            <div className="flex items-center gap-1 mt-2">
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className="pl-2 text-gray-500">47</p>
            </div>
            <p className="mt-5 text-3xl font-medium">{currency}{productdata.price}</p>
            <p className="mt-5 w-4/5 text-gray-500">{productdata.description}</p>
            
            {/* Size Selection - Only show if product has sizes */}
            {productdata.sizes?.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-medium mb-2">Select Size:</p>
                <div className="flex gap-2">
                  {productdata.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setsize(s)}
                      className={`px-4 py-2 border rounded-md ${
                        size === s ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                      } hover:bg-gray-100 transition-colors`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-5">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-white text-gray-900 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Buy Now
              </button>
            </div>
            <hr className="mt-8 sm:w-4/5" />
            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              <p>100% Original Product</p>
              <p>Cash on delivery is available on this product</p>
              <p>Easy return and exchange policy within 7 days</p>
            </div>
          </div>
        </div>
      </div>
      {/* ----- Description and review section ---- */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 text-sm py-3">Description</b>
          <b className="border px-6 py-3 text-sm">Reviews (144)</b>
        </div>
        <div className="flex flex-col text-start gap-4 border py-6 text-sm text-gray-500">
          <p className="px-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit minus ipsum vero minima, officia modi quasi facilis, ullam similique eum ut voluptatum qui magni nisi debitis facere illo, culpa aliquid? Fugit voluptas, sint ratione libero tenetur sapiente dolorum ipsum corrupti maxime voluptatibus.
          </p>
          <p className="px-3">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis sapiente veniam atque iure molestias quibusdam odit earum nostrum, eius sunt qui incidunt provident fugiat perferendis autem neque ad quaerat pariatur perspiciatis quos architecto fuga quas. Impedit, quidem nisi aspernatur quos suscipit dignissimos facilis possimus numquam? Provident necessitatibus voluptate commodi iste.
          </p>
        </div>
      </div>
      {/* display related products */}
      <RelatedProducts category={productdata.category} subCategory={productdata.subCategory} />
    </div>
  );
};

export default Product;
