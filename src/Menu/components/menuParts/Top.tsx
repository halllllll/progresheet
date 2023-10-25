import { type FC, useContext } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { MenuCtx } from '../../App';

const Top: FC = () => {
  const user = useContext(MenuCtx);

  return (
    <Box>
      <Box my={5}>
        <Text>こんにちは、 {user?.userID} さん。</Text>
        <Text>sheetname: {user?.sheetName} !!!!!</Text>
      </Box>
    </Box>
  );
};

export default Top;
