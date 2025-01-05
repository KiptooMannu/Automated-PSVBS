
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login';

function App() {
  const router = createBrowserRouter([
    {
      path: '/navbar',
      element: <Navbar />,
      // errorElement: <ErrorPage />
    },
    {
      path: '/login',
      element: <Login />,
      errorElement: <ErrorPage />
    },
  ])

  return <RouterProvider router={router} />
}

export default App
