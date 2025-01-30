import { LayoutDashboard, Book, User, Car, CreditCard, Ticket, TicketCheck, LogOut, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { store } from "../../../app/store";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

function SideNav() {
    const navigate = useNavigate();
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
        store.dispatch({ type: 'persist/PURGE', result: () => null, key: 'user-auth' });
        store.getState().user.token = null;
        navigate('/login');
    };

    return (
        <ul className="menu bg-blue-950 min-w-fit gap-1 min-h-full text-white font-semibold">
            <li>
                <details open>
                    <summary><LayoutDashboard /> Dashboard</summary>
                    <ul className="flex flex-col">
                        <li><Link to="analytics">Analytics</Link></li>
                    </ul>
                </details>
            </li>

            <li>
                <details>
                    <summary><Book /> Bookings</summary>
                    <ul>
                        <li><Link to="view_all_bookings">All Bookings</Link></li>
                        <li><Link to="booking_form">Book Now</Link></li>
                        <li><Link to="my_bookings">My Bookings</Link></li>
                    </ul>
                </details>
            </li>

            <li>
                <Link to="profile"><User /> Profile</Link>
            </li>

            <li>
                <Link to="vehicles"><Car /> Manage Vehicles</Link>
            </li>

            <li>
                <Link to="payments"><CreditCard /> Payments</Link>
            </li>

            <li>
                <Link to="tickets"><Ticket /> Tickets</Link>
            </li>

            <li>
                <Link to="all_tickets"><TicketCheck /> All Tickets</Link>
            </li>

            <li>
                <Link to="#" onClick={handleLogOut}><LogOut /> Logout</Link>
            </li>
        </ul>
    );
}

export default SideNav;