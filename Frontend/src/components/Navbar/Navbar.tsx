import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { logOut } from "../../features/users/userSlice";
import { usersAPI } from "../../features/users/usersAPI";

const Navbar = () => {
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    // const image_url = user.user?.image_url;
    // const username = user.user?.name;
    // const user_id = Number(user.user?.userID);
    // console.log(user_id)
    
    // const userRole = user.user?.role;

    // const { data: userData } = usersAPI.useGetUserByIdQuery(user_id);
    // console.log(userData.image_url);
    // const image_url = userData?.image_url;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

        window.addEventListener('resize', handleResize);
        document.addEventListener('click', closeMenu);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('click', closeMenu);
        };
    }, [isDropdownOpen]);

    const handleLogout = () => {
        dispatch(logOut());
        // navigate('/login');
    }

    return (
        <div className="navbar bg-base-100 border-b-2">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-2xl font-bold text-webcolor ml-6 md:ml-12">Automated PSV Seat Reservation System</Link>
            </div>

            <div className="flex-none gap-2">
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 text-base">
                        <li><Link to="/">Home</Link></li>
                        <li><a href="#">About</a></li>
                            <li><Link to="/dashboard/vehicles">Dashboard</Link></li>

                        <li><a href="#">Contact</a></li>
        
                            <>
                                <li><Link to="/register">Register</Link></li>
                                <li><Link to="/login">Login</Link></li>
                            </>
                 
                        <li className="flex items-center justify-center ml-3">
                        
                        </li>
                    </ul>
                </div>

                <div className="flex lg:hidden">
                    <button onClick={toggleDropdown} className="btn btn-circle">
                        {/* open icon */}
                        <svg
                            className={`swap-off fill-current ${isDropdownOpen ? 'hidden' : 'block'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 512 512">
                            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                        </svg>

                        {/* close icon */}
                        <svg
                            className={`swap-on fill-current ${isDropdownOpen ? 'block' : 'hidden'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 512 512">
                            <polygon
                                points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                        </svg>
                    </button>
                </div>

                {/* Small devices */}

            </div>
        </div>
    );
}

export default Navbar;
