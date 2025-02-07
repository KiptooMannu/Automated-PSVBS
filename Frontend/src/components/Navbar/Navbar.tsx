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

  const userId = typeof user?.user?.user_id === "number" ? user?.user?.user_id : undefined;

  const { data: userData } = usersAPI.useGetUserByIdQuery(userId as number, {
    skip: !userId,
  });

  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsDropdownOpen(false);
      }
    };

    const closeMenu = () => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", closeMenu);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    dispatch(logOut());  // ✅ Clears Redux user state
    localStorage.removeItem("user"); // ✅ Remove user from local storage
    navigate("/login");
  };

  return (
    <div className="navbar bg-slate-50 text-black shadow-md h-16 px-4 md:px-12">
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
              {/* Profile Avatar Clickable */}
              <Link to="/dashboard/profile" className="flex items-center">
  <img
    src={userData?.image_url || usericon} 
    alt="Profile"
    className="w-8 h-8 rounded-full cursor-pointer border border-gray-300"
  />
</Link>

              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn btn-ghost hover:text-gray-700"
                title="Logout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V4m0 16V4"
                  />
                </svg>
              </button>
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
