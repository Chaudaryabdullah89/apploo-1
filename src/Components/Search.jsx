import { useContext, useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { useShop } from '../Context/shopcontext';

const Search = () => {
    const { showsearch, setShowsearch, products } = useShop();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    // Memoize the search function
    const searchProducts = useCallback((term) => {
        if (!term.trim()) {
            setSearchResults([]);
            return;
        }

        const results = products?.filter(product =>
            product.name.toLowerCase().includes(term.toLowerCase()) ||
            product.description.toLowerCase().includes(term.toLowerCase())
        ) || [];
        setSearchResults(results);
    }, [products]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            searchProducts(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, searchProducts]);

    const handleProductClick = (productId) => {
        setSearchTerm('');
        setSearchResults([]);
        setShowsearch(false);
        navigate(`/product/${productId}`);
    };

    // Only render if showsearch is true and we're on the collection page
    if (!showsearch || !location.pathname.includes('collection')) return null;

    return (
        <div className="relative">
            <div className='border-t border-b bg-gray-50 text-center'>
                <div className='inline-flex item-center justify-center border border-gray px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
                    <input 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        type="text" 
                        placeholder='Search' 
                        className='flex-1 outline-none text-sm' 
                    />
                    <img src={assets.search_icon} alt="search" className='w-5' />
                </div>
                <img 
                    src={assets.cross_icon} 
                    alt="close" 
                    className='inline w-4 cursor-pointer' 
                    onClick={() => setShowsearch(false)} 
                />
            </div>
            {searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {searchResults.map((product) => (
                        <div
                            key={product._id}
                            onClick={() => handleProductClick(product._id)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">${product.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;