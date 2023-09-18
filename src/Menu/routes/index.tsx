import { Navigate, createBrowserRouter } from 'react-router-dom';
import Home from '../components/Home';
import ErrorPage from '../components/error-page';
import Info from '../components/menuParts/Info';
import InitSheet from '../components/menuParts/Init/init';
import Top from '../components/menuParts/Top';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Top /> },
      {
        path: 'init',
        element: <InitSheet />,
      },
      {
        path: 'labels',
        element: <Info />,
      },
      {
        path: 'info',
        element: <Info />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
