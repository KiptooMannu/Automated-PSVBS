import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { logOut } from "../../features/users/userSlice";
import { usersAPI } from "../../features/users/usersAPI";
import usericon from "../../assets/usericon.png";
import {
  FaHome,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaInfoCircle,
  FaComments,
  FaEnvelope,
  FaBus,
} from "react-icons/fa";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch user data if the user is logged in
  const userId = typeof user?.user?.user_id === "number" ? user.user.user_id : undefined;
  const { data: userData } = usersAPI.useGetUserByIdQuery(userId as number, {
    skip: !userId,
  });

  // Handle logout
  const handleLogout = () => {
    dispatch(logOut());
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const profileDropdown = document.getElementById("profile-dropdown");
      const profileButton = document.getElementById("profile-btn");
      const authDropdown = document.getElementById("auth-dropdown");
      const authButton = document.getElementById("auth-btn");

      // Close Profile Dropdown if clicked outside
      if (
        profileDropdown &&
        !profileDropdown.contains(event.target as Node) &&
        profileButton &&
        !profileButton.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }

      // Close Auth Dropdown if clicked outside
      if (
        authDropdown &&
        !authDropdown.contains(event.target as Node) &&
        authButton &&
        !authButton.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }

      // Close Mobile Menu if clicked outside
      const mobileMenu = document.getElementById("mobile-menu");
      const mobileMenuButton = document.getElementById("mobile-menu-button");
      if (
        mobileMenu &&
        !mobileMenu.contains(event.target as Node) &&
        mobileMenuButton &&
        !mobileMenuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    // Add event listener when dropdowns or mobile menu are open
    if (isProfileOpen || isDropdownOpen || isMobileMenuOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isProfileOpen, isDropdownOpen, isMobileMenuOpen]);

  // Function to close the mobile menu when a link is clicked
  const handleMobileMenuLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="navbar bg-white text-black shadow-md h-16 px-4 md:px-12 relative">
      <div className="flex justify-between items-center w-full mx-auto">
        {/* Title */}
        <Link
          to="/"
          className="text-2xl font-bold text-slate-900 hover:text-gray-700 transition-colors duration-300 flex items-center gap-2"
        >
          <FaBus className="text-blue-600" />
          <span className="hidden md:inline">Automated Public Service Vehicle Seat Booking System</span>
          <span className="md:hidden">APSV SBS</span> {/* Shortened title for mobile */}
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center space-x-6 text-base">
            <li>
              <Link to="/" className="hover:text-gray-700 transition-colors duration-300 flex items-center gap-2">
                <FaHome />
                <span>Home</span>
              </Link>
            </li>

            <li>
              <Link
                to="/dashboard/booking_form"
                className="hover:text-gray-700 transition-colors duration-300 flex items-center gap-2"
              >
                <FaUser />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/about" className="hover:text-gray-700 transition-colors duration-300 flex items-center gap-2">
                <FaInfoCircle />
                <span>About</span>
              </Link>
            </li>

            <li>
              <Link
                to="/testimonials"
                className="hover:text-gray-700 transition-colors duration-300 flex items-center gap-2"
              >
                <FaComments />
                <span>Testimonials</span>
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-gray-700 transition-colors duration-300 flex items-center gap-2">
                <FaEnvelope />
                <span>Contact</span>
              </Link>
            </li>

            {!user.user ? (
              <li className="relative">
                {/* Auth Icon Button */}
                <button
                  id="auth-btn"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center"
                >
                  <img
                    src={usericon}
                    alt="Auth"
                    className="w-8 h-8 rounded-full cursor-pointer border border-gray-300"
                  />
                </button>

                {/* Auth Dropdown */}
                {isDropdownOpen && (
                  <div
                    id="auth-dropdown"
                    className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50"
                  >
                    <Link
                      to="/register"
                      className="flex px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md items-center gap-2"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaUser />
                      <span>Register</span>
                    </Link>
                    <Link
                      to="/login"
                      className="flex px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md items-center gap-2"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaSignInAlt />
                      <span>Login</span>
                    </Link>
                  </div>
                )}
              </li>
            ) : (
              <li className="relative">
                {/* Profile Icon */}
                <button
                  id="profile-btn"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center"
                >
                  <img
                    src={userData?.image_url || usericon}
                    alt="Profile"
                    className="w-8 h-8 rounded-full cursor-pointer border border-gray-300"
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div
                    id="profile-dropdown"
                    className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50"
                  >
                    <Link
                      to="/dashboard/profile"
                      className="flex px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md items-center gap-2"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FaUser />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200 rounded-md items-center gap-2"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-button"
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="btn btn-circle lg:hidden"
            title="Toggle Menu"
          >
            <svg
              className={`swap-off fill-current ${isMobileMenuOpen ? "hidden" : "block"}`}
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>
            <svg
              className={`swap-on fill-current ${isMobileMenuOpen ? "block" : "hidden"}`}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden absolute top-16 left-0 w-full bg-white shadow-md z-40">
          <ul className="flex flex-col space-y-4 p-4">
            <li>
              <Link
                to="/"
                className="hover:text-gray-700 transition-colors duration-300 flex items-center gap-2 text-sm"
                onClick={handleMobileMenuLinkClick}
              >
                <FaHome />
                <span>Home</span>
              </Link>
            </li>

            <li>
              <Link
                to="/dashboard/booking_form"
                className="hover:text-gray-700 transition-colors duration-300 flex items-center gap-2 text-sm"
                onClick={handleMobileMenuLinkClick}
              >
                <FaUser />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="hover:text-gray-700 transition-colors duration-300 flex items-center gap-2 text-sm"
                onClick={handleMobileMenuLinkClick}
              >
                <FaInfoCircle />
                <span>About</span>
              </Link>
            </li>

            <li>
              <Link
                to="/testimonials"
                className="hover:text-gray-700 transition-colors duration-300 flex items-center gap-2 text-sm"
                onClick={handleMobileMenuLinkClick}
              >
                <FaComments />
                <span>Testimonials</span>
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="hover:text-gray-700 transition-colors duration-300 flex items-center gap-2 text-sm"
                onClick={handleMobileMenuLinkClick}
              >
                <FaEnvelope />
                <span>Contact</span>
              </Link>
            </li>

            {!user.user ? (
              <li>
                <Link
                  to="/login"
                  className="flex px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md items-center gap-2 text-sm"
                  onClick={handleMobileMenuLinkClick}
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
              </li>
            ) : (
              <li>
                <button
                  onClick={handleLogout}
                  className="flex w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200 rounded-md items-center gap-2 text-sm"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;