import { Users, SquareUserRound, Menu, LogOut, Settings, Book } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { store } from "../../../app/store"
// import { UseDispatch } from "react-redux"
import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../../app/store"
import { useEffect } from "react"

function SideNav() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const user = useSelector((state: RootState) => state.user);
    const role = user.user?.role ?? 'user';
    console.log(role);
  

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
      };

    
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 124) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

    const handleLogOut = () => {
        //clear the local storage & reset the state
        store.dispatch({ type: 'persist/PURGE', result: () => null, key: 'user-auth' })
        store.getState().user.token = null
        navigate('/login')
    }


    return (
        <ul className="menu bg-base-200 min-w-fit gap-1 text-base-content min-h-full text-white-400 font-semibold  ">
            <li>
                <details open >
                    <summary ><Menu />Dashboard</summary>
                    <ul className="flex flex-col">
                        <li> <Link to="analytics">Analytics</Link></li>
                    </ul>
                </details>
            </li>
            
            
            <li>
                <details >
                    <summary><Book />Bookings </summary>
                    <ul>
                        
                        <li><Link to="view_all_bookings">All Bookings</Link></li>
                        <li><Link to="my_bookings">My Bookings</Link></li>
                        
                    </ul>
                </details>
            </li>
            <li>
                <Link to="profile"><SquareUserRound />Profile</Link>
            </li>
          
            <li>
                <Link to="tickets"><Users />Tickets</Link>
            </li>
            <li>
                <Link to="payments"><Settings />Payments</Link>
            </li>
            <li>
                <Link to="profile"><Settings />Profile</Link>
            </li>
            <li><Link to="booking_form"></Link>Book Now</li>
            <li>
                <Link to="#" onClick={handleLogOut}><LogOut />Logout</Link>
            </li>
            
        </ul>
    )
}

export default SideNav