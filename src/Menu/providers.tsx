import { type FC } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router';
import CtxProvider from './contexts/CtxProvider';
import router from './routes/index';

const Providers: FC = () => {
  return (
    <CtxProvider>
      <Toaster />
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </CtxProvider>
  );
};

export default Providers;
