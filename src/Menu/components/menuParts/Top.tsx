import { type FC, useContext } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { MenuCtx } from '../../App';

const Top: FC = () => {
  const user = useContext(MenuCtx);

  return (
    <Box>
      <Text>hello! {user?.userID} !!!</Text>
      <Text>sheetname: {user?.sheetName} !!!!!</Text>
    </Box>
  );
};

export default Top;
