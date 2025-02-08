import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { logOut } from "../../features/users/userSlice";
import { usersAPI } from "../../features/users/usersAPI";
import usericon from '../../assets/usericon.png'

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userId = typeof user?.user?.user_id === "number" ? user?.user?.user_id : undefined;
  const { data: userData } = usersAPI.useGetUserByIdQuery(userId as number, {
    skip: !userId,
  });

  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const dropdown = document.getElementById("profile-dropdown");
      const profileButton = document.getElementById("profile-btn");
  
      // ✅ Only close dropdown if the click is outside both the profile button and dropdown
      if (
        dropdown && !dropdown.contains(event.target as Node) &&
        profileButton && !profileButton.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
  
    if (isProfileOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }
  
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isProfileOpen]);
  
  const toggleProfile = (event: React.MouseEvent) => {
    event.stopPropagation(); // ✅ Prevents immediate closing when clicked
    setIsProfileOpen((prev) => !prev);
  };
  







  
  const handleLogout = () => {
    dispatch(logOut());  // ✅ Clears Redux user state
    localStorage.removeItem("user"); // ✅ Remove user from local storage
    navigate("/login");
  };

  
  return (
    <div className="navbar bg-slate-50 text-black shadow-md h-16 px-4 md:px-12 relative">
      <div className="flex justify-between items-center w-full mx-auto">
        {/* Title */}
        <Link
          to="/"
          className="text-2xl font-bold text-slate-900 hover:text-gray-700 transition-colors duration-300"
        >
          Automated Seat Reservation System
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center space-x-6 text-base">
            <li>
              <Link to="/" className="hover:text-gray-700 transition-colors duration-300">
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/dashboard/booking_form"
                className="hover:text-gray-700 transition-colors duration-300"
              >
                Dashboard
              </Link>
            </li>
    
            <li>
  <Link to="/about" className="hover:text-gray-700 transition-colors duration-300">
    About
  </Link>
</li>
<li>
  <Link to="/testimonials" className="hover:text-gray-700 transition-colors duration-300">
    Testimonials
  </Link>
</li>
<li>
  <Link to="/contact" className="hover:text-gray-700 transition-colors duration-300">
    Contact
  </Link>
</li>

            
            {!userData ? (
              <>
                <li>
                  <Link to="/register" className="hover:text-gray-700 transition-colors duration-300">
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-gray-700 transition-colors duration-300">
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <li className="flex items-center space-x-4">
{/* Profile Avatar with Dropdown Toggle */}
{/* Profile Avatar with Dropdown Toggle */}
<div className="relative">
  <button id="profile-btn" onClick={toggleProfile} className="flex items-center">
    <img
      src={userData?.image_url || usericon}
      alt="Profile"
      className="w-8 h-8 rounded-full cursor-pointer border border-gray-300"
    />
  </button>

  {/* Profile Dropdown Menu */}
  {isProfileOpen && (
    <div
      id="profile-dropdown"
      className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50"
      >
      <Link
        to="/dashboard/profile"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md"
        onClick={() => setIsProfileOpen(false)}
      >
        View Profile
      </Link>
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200 rounded-md"
      >
        Logout
      </button>
    </div>
  )}
</div>


            </li>
            
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleDropdown}
            className="btn btn-circle lg:hidden"
            title="Toggle Menu"
          >
            <svg
              className={`swap-off fill-current ${isDropdownOpen ? "hidden" : "block"}`}
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>
            <svg
              className={`swap-on fill-current ${isDropdownOpen ? "block" : "hidden"}`}
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 366.51 289.49 256 400 145.49" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
