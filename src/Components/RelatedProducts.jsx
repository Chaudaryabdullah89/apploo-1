import React, { useContext, useEffect, useState } from 'react';
import { useShop } from '../Context/shopcontext';
import Productitem from './productitem';
import Title from './Title';


const RelatedProducts = ({ category, subCategory }) => {
    const { products, currency, addtocart } = useShop();
const [relatedProducts, setRelatedProducts] = useState([])
// console.log(relatedProducts);

    useEffect(() => {
        if (products.length > 0) {
            let productscopy = products.slice();
            productscopy = productscopy.filter((item) => item.category === category && item.subCategory === subCategory);
            setRelatedProducts(productscopy.slice(0, 5));
        }
    }, [products, category, subCategory]);

    return (
        <div className='my-24'>
<div className='text-center text-3xl py-2 flex flex-col gap-10'>
    <Title text1='Related' text2='Products'  />
<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
{
relatedProducts.map((product, index) => (
  <Productitem key={`${product._id}-${index}`} id={product._id} name={product.name} price={product.price} image={product.image} />
))
}
</div>
</div>
        </div>
    );
}


export default RelatedProducts;