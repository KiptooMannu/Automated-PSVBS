import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Drawer from "./aside/Drawer";
import ProtectedRoute from "../../pages/auth/Protectedroute";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <ProtectedRoute>
        <div className="flex flex-row flex-grow">
          <div className="hidden md:block min-w-fit bg-base-200">
            <Drawer />
          </div>
          <div className="flex flex-col flex-grow p-4">
            <Outlet />
          </div>
        </div>
      </ProtectedRoute>
      <Footer />
    </>
  );
};

export default Dashboard;