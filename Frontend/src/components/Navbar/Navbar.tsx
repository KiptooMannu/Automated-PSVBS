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
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userId = typeof user?.user?.user_id === "number" ? user.user.user_id : undefined;
  const { data: userData } = usersAPI.useGetUserByIdQuery(userId as number, {
    skip: !userId,
  });

  const handleLogout = () => {
    dispatch(logOut());
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const profileDropdown = document.getElementById("profile-dropdown");
      const profileButton = document.getElementById("profile-btn");
      const authDropdown = document.getElementById("auth-dropdown");
      const authButton = document.getElementById("auth-btn");
      const mobileMenu = document.getElementById("mobile-menu");
      const mobileMenuButton = document.getElementById("mobile-menu-button");

      if (
        profileDropdown &&
        !profileDropdown.contains(event.target as Node) &&
        profileButton &&
        !profileButton.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }

      if (
        authDropdown &&
        !authDropdown.contains(event.target as Node) &&
        authButton &&
        !authButton.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }

      if (
        mobileMenu &&
        !mobileMenu.contains(event.target as Node) &&
        mobileMenuButton &&
        !mobileMenuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isProfileOpen || isDropdownOpen || isMobileMenuOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isProfileOpen, isDropdownOpen, isMobileMenuOpen]);

  const handleMobileMenuLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="navbar bg-white text-black shadow-md h-16 px-4 md:px-12 relative"
    >
      <div className="flex justify-between items-center w-full mx-auto">
        {/* Title */}
        <Link
          to="/"
          className="text-2xl font-bold text-slate-900 hover:text-gray-700 transition-colors duration-300 flex items-center gap-2"
        >
          <FaBus className="text-blue-600" />
          <span className="hidden md:inline">Automated Public Service Vehicle Seat Booking System</span>
          <span className="md:hidden">APSV SBS</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center space-x-6 text-base">
            {[
              { to: "/", icon: <FaHome />, text: "Home" },
              { to: "/dashboard/booking_form", icon: <FaUser />, text: "Dashboard" },
              { to: "/about", icon: <FaInfoCircle />, text: "About" },
              { to: "/testimonials", icon: <FaComments />, text: "Testimonials" },
              { to: "/contact", icon: <FaEnvelope />, text: "Contact" },
            ].map((link, index) => (
              <li key={index}>
                <Link
                  to={link.to}
                  className="hover:text-gray-700 transition-colors duration-300 flex items-center gap-2"
                >
                  {link.icon}
                  <span>{link.text}</span>
                </Link>
              </li>
            ))}

            {!user.user ? (
              <li className="relative">
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

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      id="auth-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ) : (
              <li className="relative">
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

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      id="profile-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
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
                    </motion.div>
                  )}
                </AnimatePresence>
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
            <motion.svg
              className={`swap-off fill-current ${isMobileMenuOpen ? "hidden" : "block"}`}
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </motion.svg>
            <motion.svg
              className={`swap-on fill-current ${isMobileMenuOpen ? "block" : "hidden"}`}
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
              animate={{ rotate: isMobileMenuOpen ? 0 : 90 }}
            >
              <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 366.51 289.49 256 400 145.49" />
            </motion.svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-16 left-0 w-full bg-white shadow-md z-40"
          >
            <ul className="flex flex-col space-y-4 p-4">
              {[
                { to: "/", icon: <FaHome />, text: "Home" },
                { to: "/dashboard/booking_form", icon: <FaUser />, text: "Dashboard" },
                { to: "/about", icon: <FaInfoCircle />, text: "About" },
                { to: "/testimonials", icon: <FaComments />, text: "Testimonials" },
                { to: "/contact", icon: <FaEnvelope />, text: "Contact" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="hover:text-gray-700 transition-colors duration-300 flex items-center gap-2 text-sm"
                    onClick={handleMobileMenuLinkClick}
                  >
                    {link.icon}
                    <span>{link.text}</span>
                  </Link>
                </li>
              ))}

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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;