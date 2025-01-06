
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
        path: 'book_form',
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
    ]
  }
  ])

  return <RouterProvider router={router} />
}

export default App
