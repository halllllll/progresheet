// import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import Home from '../components/Home';
import ErrorPage from '../components/error-page';
import Info from '../components/menuParts/Info';
import Init from '../components/menuParts/Init/init';
import Top from '../components/menuParts/Top';

// const Home = lazy(async () => await import('../components/Home'));
// const Info = lazy(async () => await import('../components/menuParts/Info'));
// const Top = lazy(async () => await import('../components/menuParts/Top'));
// const Init = lazy(
//   async () => await import('../components/menuParts/Init/init')
// );

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Top /> },
      {
        path: 'info',
        element: <Info />,
      },
      {
        path: 'init',
        element: <Init />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
