import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import assets from '../assets/assets.js';
import { useCart } from '../Context/CartContext';
import { useUserAuth } from '../Context/UserAuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { getCartCount } = useCart();
  const { user, logout } = useUserAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <  >
      <div className= ' px-24 flex z-50 items-center justify-between py-5 font-semibold text-md'>
        <Link to="/">
          <img src={assets.logo} alt="Logo" className="w-36" />
        </Link>
        <ul className='hidden sm:flex gap-10 text-sm text-gray-700'>
          <NavLink to='/'>
            <p>Home</p>
            <hr className='bg-gray-700 w-full border-none h-[1.5px] hidden' />
          </NavLink>
          <NavLink to='/collection'>
            <p>Collection</p>
            <hr className='bg-gray-700 w-full border-none h-[1.5px] hidden' />
          </NavLink>
          <NavLink to='/about'>
            <p>About</p>
            <hr className='bg-gray-700 w-full border-none h-[1.5px] hidden' />
          </NavLink>
          {/* <NavLink to='/blog'>
            <p>Blog</p>
            <hr className='bg-gray-700 w-full border-none h-[1.5px] hidden' />
          </NavLink> */}
          <NavLink to='/contact'>
            <p>Contact</p>
            <hr className='bg-gray-700 w-full border-none h-[1.5px] hidden' />
          </NavLink>
        </ul>

        <div className="flex items-center gap-5">
          <img
            src={assets.search_icon}
            alt="search"
            className='w-5 transition-all cursor-pointer'
            onClick={() => setShowsearch(true)}
          />
          <div className="relative group">
            <Link to='/profile' className='flex items-center gap-2'>
              <img src={assets.profile_icon} alt="" className='w-5 cursor-pointer' />
            </Link>
            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-grey-500">
                <NavLink to='/profile' className="flex items-center gap-2 hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <p className="cursor-pointer">My Profile</p>
                </NavLink>
                <NavLink to='/order' className="flex items-center gap-2 hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  <p className="cursor-pointer">Order</p>
                </NavLink>
                {user && (
                  <>
                    {/* <NavLink to='/write-blog' className="flex items-center gap-2 hover:text-black">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      <p className="cursor-pointer">Write Blog</p>
                    </NavLink>
                    <NavLink to='/my-blogs' className="flex items-center gap-2 hover:text-black">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      <p className="cursor-pointer">My Blogs</p>
                    </NavLink> */}
                  </>
                )}
                {!user ? (
                  <>
                    <NavLink to='/register' className="flex items-center gap-2 hover:text-black">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                      <p className="cursor-pointer">Register</p>
                    </NavLink>
                    <NavLink to='/login' className="flex items-center gap-2 hover:text-black">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="cursor-pointer">Login</p>
                    </NavLink>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:text-black w-full text-left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
                    </svg>
                    <p className="cursor-pointer">Logout</p>
                  </button>
                )}
              </div>
            </div>
          </div>
          <Link to='/cart'>
            <img src={assets.cart_icon} alt="Cart Icon" className='top-[10px] relative w-5' />
            <p className='relative bottom-[2px] left-2 text-center leading-4 bg-black text-white items-center aspect-square rounded-full text-[10px]'>
              <span className='relative top-[2px]'>{getCartCount()}</span>
            </p>
          </Link>

          {/* Side Menu For smaller screens */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt=""
            className='sm:hidden w-5 cursor-pointer'
          />
        </div>

        {/* Mobile Menu */}
        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
          <div className="flex flex-col text-gray-600">
            <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3'>
              <img src={assets.dropdown_icon} alt="Logo" className="h-4 rotate-180 cursor-pointer" />
              <p className='cursor-pointer'>Back</p>
            </div>
          </div>
          <div className='flex flex-col'>
            <NavLink onClick={() => setVisible(false)} className='py-3 pl-6 border uppercase' to='/'>
              Home
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-3 pl-6 border uppercase' to='/collection'>
              Collection
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-3 pl-6 border uppercase' to='/about'>
              About
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-3 pl-6 border uppercase' to='/contact'>
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
