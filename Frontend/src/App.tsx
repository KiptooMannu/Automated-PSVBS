
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login';
import HomePage from './pages/landingPage/HomePage';
import Register from './pages/Register';
import Dashboard from './pages/dashboard/dashboard';
import Footer from './components/Footer/Footer';
import Profile from './pages/dashboard/main/Profile';
import BookingForm from './pages/dashboard/main/Booking/BookingForm';
import AllBookings from './pages/dashboard/main/Booking/AllBookings';
import MyBookings from './pages/dashboard/main/Booking/MyBookings';
import MapSeat from './pages/dashboard/main/Booking/MapSeat';
import CreateVehicleForm from './pages/dashboard/main/Vehicles/CreateVehicleForm';
import CreateVehicleModal from './pages/dashboard/main/Vehicles/CreateVehicleForm';
import DeleteVehicleModal from './pages/dashboard/main/Vehicles/DeleteVehicle';
import EditVehicleModal from './pages/dashboard/main/Vehicles/EditVehicle';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />,
      errorElement: <ErrorPage />
    },
    {
      path: '/navbar',
      element: <Navbar />,
      errorElement: <ErrorPage />
    },
    {
      path: '/footer',
      element: <Footer />,
      errorElement: <ErrorPage />
    },
    {
      path: '/login',
      element: <Login />,
      errorElement: <ErrorPage />
    },
    {
      path: '/register',
      element: <Register />,
      errorElement: <ErrorPage />
    },
    {
      path: 'map_seat',
      element: <MapSeat />
    },
    // DASHBOARD ROUTES
  {
    path: 'dashboard',
    element: <Dashboard />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'book_now',
        element: <Profile />
      },
      {
        path: 'booking_form',
        element: <BookingForm />
      },
      {
        path: 'view_all_bookings',
        element: <AllBookings />
      },
      {
        path: 'my_bookings',
        element: <MyBookings />
      },
      {
        path: 'create_vehicle',
        element: <CreateVehicleModal />
      },
      {
        path: 'edit_vehicle',
        element: <EditVehicleModal />
      },
      {
        path: 'delete_vehicle',
        element: <DeleteVehicleModal />
      },
    ]
  }
  ])

  return <RouterProvider router={router} />
}

export default App
