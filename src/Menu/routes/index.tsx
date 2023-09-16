import { Navigate, createBrowserRouter } from 'react-router-dom';
import Home from '../components/Home';
import Parent from '../components/Parent';
import ErrorPage from '../components/error-page';
import Info from '../components/menuParts/Info';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Parent /> },
      {
        path: 'info',
        element: <Info />,
      },
      {
        path: 'parent',
        element: <Parent />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
