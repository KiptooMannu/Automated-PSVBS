import { drawerData } from "../../../components/Drawer/drawerData";
import { LayoutDashboard, ChevronsRight, ChevronsLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { store } from "../../../app/store";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

type DrawerData = {
  id: string | number;
  link: string;
  icon?: React.ElementType;
  name: string;
  adminOnly?: boolean;
};

function SideNav() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  // Function to determine if user is admin
  const checkAdminStatus = () => {
    if (user.user?.role === 'admin') {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [user]); // Trigger effect on user change

  // Function to filter drawer items based on user role
  const filterDrawerItems = (item: DrawerData): boolean => {
    if (isAdmin) {
      return true; // Show all items to admin
    } else {
      return !item.adminOnly; // Show only non-admin items to non-admin users
    }
  };

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
    <>
      {/* Drawer toggle button */}
      <button
        className={`fixed left-0 top-0 z-50 p-3 mt-11`}
        type="button"
        onClick={toggleDrawer}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <ChevronsLeft className="text-white block lg:hidden" size={45} />
        ) : (
          <ChevronsRight className="text-white block lg:hidden" size={45} />
        )}
      </button>

      <div className={`left-0 z-40 min-h-screen p-4 overflow-y-auto transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-58 bg-gray-700 border-2 lg:translate-x-0`} tabIndex={-1} aria-labelledby="drawer-body-scrolling-label">
        <div className="flex justify-between items-center">
          <h5 id="drawer-body-scrolling-label" className="font-semibold text-gray-300 uppercase mt-0">
            <LayoutDashboard />
            Dashboard
          </h5>
          {/* Close button */}
          <button
            className="text-white"
            type="button"
            onClick={toggleDrawer}
            aria-label="Close menu"
          >
            <ChevronsLeft className="block lg:hidden" />
          </button>
        </div>

        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium mb-8">
            {drawerData.filter(filterDrawerItems).map((item) => (
              <li key={item.id}>
                <Link
                  to={item.link}
                  className="text-gray-200 hover:bg-gray-600 block px-3 py-2 rounded-md text-justify"
                  aria-label={item.name}
                >
                  {item.icon && <item.icon className="inline-block mr-2" size={30} />}
                  {item.name}
                </Link>
                {item.name === 'Log Out' && (
                  <button
                    type="button"
                    onClick={handleLogOut}
                    className="text-gray-200 hover:bg-gray-600 block px-3 py-2 rounded-md text-justify"
                    aria-label="Log out"
                  >
                    {item.icon && <item.icon className="inline-block mr-2" size={30} />}
                    {item.name}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default SideNav;
