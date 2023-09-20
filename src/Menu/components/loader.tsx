import { type FC, type ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

type LoaderProps = {
  children?: ReactNode;
};

const Full: FC<LoaderProps> = ({ children }) => {
  return (
    <Box
      position="fixed"
      zIndex="1000"
      left="0"
      top="0"
      w="100vw"
      h="100vh"
      bg="rgba(0, 0, 0, 0.1)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {children}
    </Box>
  );
};

export default Full;
