import { Navigate, createBrowserRouter } from 'react-router-dom';
import Home from '../components/Home';
import ErrorPage from '../components/error-page';
import Info from '../components/menuParts/Info';
import Parent from '../components/menuParts/Top';

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
