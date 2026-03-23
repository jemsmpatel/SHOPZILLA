import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useGetallcategoryQuery } from "../redux/api/Category";
import { useGetUserCartQuery } from "../redux/api/users";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { userInfo } = useSelector((state) => state.userAuth);
  const { data: response } = useGetallcategoryQuery("tree=true&active=true");
  const { data: cartData } = useGetUserCartQuery();
  const cartCount = cartData?.cartItems?.length || 0;
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  // Outside click close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/search?keyword=${keyword}`);
    }
  };

  const [activeCategory, setActiveCategory] = useState(null);

  const categories = response?.data || [];

  return (
    <header className="w-full font-sans sticky top-0 z-[100]">
      {/* Top Section */}
      <nav className="bg-[#131921] flex items-center p-2.5 px-4 md:px-5 gap-3 md:gap-5 text-white">
        {/* Logo */}
        <Link
          to={"/"}
          className="text-xl md:text-2xl font-bold text-[#febd69] cursor-pointer whitespace-nowrap"
        >
          SHOPZILLA
        </Link>

        {/* Search Bar (Mobile par chota, Desktop par flex-1) */}
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex flex-1 h-10 rounded overflow-hidden"
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 border-none px-4 outline-none text-black text-sm"
            placeholder="Search for products..."
          />
        </form>

        {/* User Actions */}
        <div className="flex gap-4 md:gap-6 items-center ml-auto">
          {/* Account */}
          <div ref={dropdownRef} className="relative cursor-pointer p-1">
            {/* ACCOUNT BUTTON */}
            <div
              onClick={() => {
                if (userInfo) {
                  navigate("/profile");
                } else {
                  setOpen(!open);
                }
              }}
            >
              <span className="hidden md:block text-xs text-gray-300">
                Hello {userInfo ? userInfo.fname : "Sign in"}
              </span>

              <span className="text-xs md:text-sm font-bold whitespace-nowrap">
                {userInfo ? "My Account" : "Account ▼"}
              </span>
            </div>

            {/* Dropdown (only if not logged in) */}
            {!userInfo && open && (
              <div className="absolute top-full right-0 md:-right-10 bg-white text-gray-800 w-[220px] md:w-[260px] rounded-xl shadow-2xl z-[110] mt-2 border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <Link to="/signin" onClick={() => setOpen(false)}>
                    <button className="w-full py-2 rounded-md cursor-pointer bg-gradient-to-b from-[#f8e3ad] to-[#eeba37] border border-[#a88734] font-semibold text-sm hover:shadow-md transition duration-200">
                      Sign In
                    </button>
                  </Link>

                  <p className="text-xs mt-2 text-center">
                    New customer?{" "}
                    <Link
                      to="/signup"
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() => setOpen(false)}
                    >
                      Start here.
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            to={"/cart"}
            className="text-center cursor-pointer relative flex items-center gap-1"
          >
            <div className="relative">
              <span className="absolute -top-2 -right-1 bg-[#febd69] text-black text-xs font-bold px-1.5 rounded-full">
                {cartCount}
              </span>

              <span className="text-xl md:text-2xl">🛒</span>
            </div>

            <span className="hidden sm:block text-sm font-bold">Cart</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Search Bar (Sirf phone par dikhega) */}
      <div className="sm:hidden bg-[#131921] px-4 pb-3">
        <div className="flex h-9 rounded overflow-hidden">
          <input
            type="text"
            className="flex-1 border-none px-3 outline-none text-black text-sm"
            placeholder="Search Shopzilla"
          />
        </div>
      </div>

      {/* Bottom Section: Categories */}
      {/* Desktop View: Horizontal List | Mobile View: Toggle Menu */}
      <div className="relative border-y border-gray-200 bg-[#232f3e] hidden md:block z-50">
        <div className="max-w-[1400px] mx-auto px-4">
          {/* Main Category List - Scrollable & No-Wrap */}
          <ul className="flex items-center list-none m-0 p-0 overflow-x-auto no-scrollbar whitespace-nowrap">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="group cursor-pointer py-3 text-[14px] font-medium text-white hover:text-orange-500 hover:border-b-2 hover:border-orange-500 transition-all px-4 inline-block"
                onMouseEnter={() => setActiveCategory(cat._id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                {cat.name}

                {activeCategory === cat._id && (
                  <div className="absolute left-16 right-0 top-[100%] bg-white shadow-2xl border-t border-gray-100 p-8 flex justify-center w-[90%]">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 max-w-[1300px] w-full">
                      {cat.subCategories?.map((sub) => (
                        <div
                          key={sub._id}
                          className="flex flex-col space-y-2 min-w-[150px]"
                        >
                          <Link
                            key={sub._id}
                            to={`/category/${sub._id}`}
                            className="font-bold text-orange-500 text-sm mb-3 border-b border-orange-100 pb-1"
                          >
                            {sub.name}
                          </Link>

                          {sub.subCategories?.map((child) => (
                            <Link
                              key={child._id}
                              to={`/category/${child._id}`}
                              className="text-gray-500 hover:text-black text-sm transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Global & Custom Styles */}
        <style jsx>{`
          /* Hide scrollbar but keep functionality */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(5px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.15s ease-out;
          }
        `}</style>
      </div>
    </header>
  );
};

export default Navbar;
