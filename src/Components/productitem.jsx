import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../Context/shopcontext';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

const Productitem = ({ id, name, price, image }) => {
    const { currency, addtocart } = useShop();
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!image || typeof image !== 'string') {
            console.error('Invalid image prop:', image);
            setImageError(true);
            setIsLoading(false);
            return;
        }

        setImageUrl(image);
        
        const img = new Image();
        img.onload = () => {
            setIsLoading(false);
            setImageError(false);
        };
        img.onerror = () => {
            setImageError(true);
            setIsLoading(false);
            setImageUrl('/placeholder.png');
        };
        img.src = image;
    }, [image]);

    const handleImageError = (e) => {
        setImageError(true);
        e.target.onerror = null;
        e.target.src = '/placeholder.png';
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addtocart(id, 'default');
        toast.success('Item added to cart');
    };

    return (
        <div 
            className="text-gray-700 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={`/product/${id}`} className="block">
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {isLoading && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    )}
                    {!isLoading && !imageError && imageUrl && (
                        <img 
                            src={imageUrl} 
                            alt={name} 
                            className={`w-full h-full object-cover transition-all duration-500 ${
                                isHovered ? 'scale-110' : 'scale-100'
                            }`}
                            onError={handleImageError}
                            loading="lazy"
                        />
                    )}
                    {!isLoading && (imageError || !imageUrl) && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-500">Image not available</span>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{name}</h3>
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-gray-900">{currency}{price}</p>
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
                            <span className="text-sm text-gray-600 ml-2">(120)</span>
                        </div>
                    </div>
                </div>
            </Link>
            <button
                onClick={handleAddToCart}
                className={`w-full mt-2 bg-gray-900 text-white py-3 rounded-lg transition-all duration-300 ${
                    isHovered ? 'bg-gray-800 transform -translate-y-1' : 'hover:bg-gray-800'
                }`}
            >
                Add to Cart
            </button>
        </div>
    );
}

Productitem.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired
};

export default Productitem;