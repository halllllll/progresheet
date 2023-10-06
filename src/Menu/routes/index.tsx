import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import InitSheet from '../components/menuParts/Init/init';
import ClassData from '../components/menuParts/classData/classData';
const Labels = lazy(async() => await import ('../components/menuParts/labels/labels'));
const Top = lazy(async() => await import ('../components/menuParts/Top'));
const Info = lazy(async()=>await import( '../components/menuParts/Info'));
const Home = lazy(async() => await import ('../components/Home'));
const ErrorPage = lazy(async () => await import('../components/error-page'));

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
        element: <Labels />,
      },
      {
        path: "class_data",
        element: <ClassData />
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
