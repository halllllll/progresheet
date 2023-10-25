import { useContext, type FC } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { ClassDataCtx, SetClassDataCtx } from '../classData';

import { ContextError } from '@/Menu/errors';

const Layout: FC = () => {
  const _setClassDataCtx = useContext(SetClassDataCtx);
  const classDataCtx = useContext(ClassDataCtx);
  if (classDataCtx === null)
    throw new ContextError('non-context error', {
      details: 'on AmountManager',
    });

  return (
    <Box>
      <Text>a</Text>
      {classDataCtx.seats.map((seat) => {
        return (
          <Box key={seat.index}>
            <Text>
              {seat.index} {seat.name}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};

export default Layout;
