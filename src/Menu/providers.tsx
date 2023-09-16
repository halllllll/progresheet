import { type FC } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider } from 'react-router';
import CtxProvider from './contexts/CtxProvider';
import router from './routes/index';

const Providers: FC = () => {
  return (
    <CtxProvider>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </CtxProvider>
  );
};

export default Providers;
