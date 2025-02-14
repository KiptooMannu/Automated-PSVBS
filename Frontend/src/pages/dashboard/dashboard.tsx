import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Drawer from "./aside/Drawer";
// import Container from "../../components/Container/Container";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      {/* <Container className="flex flex-col min-h-screen bg-gray-800 text-neutral-200 mb-"> */}
        <div className="flex flex-row flex-grow">
          <div className="hidden md:block min-w-fit bg-base-200">
            <Drawer />
          </div>
          <div className="flex flex-col flex-grow p-4">
            <Outlet />
          </div>
        </div>
      {/* </Container> */}
      <Footer />
    </>
  );
};

export default Dashboard;